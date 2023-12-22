import { Product, CDKey } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import MySQL from "@/models/MySQL";
import { Platform } from "@/models/Platform";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === 'POST') {
    const { title, description, price, images, platform, category } = req.body;

    // Generate a single CD key
    const generatedCDKey = await generateCDKey();

    // Create the Product document with a single CD key reference
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      platform,
      category,
      cdKey: { key: generatedCDKey },
    });



    const newPlat = await Platform.findOne({_id:platform});
    var platName = JSON.parse(JSON.stringify(newPlat)).name;

    // Untested Queries

    // Create new products in mysql server
    try{
    MySQL.query("INSERT INTO products(Platform_ID, Product_name, Product_desc, Price) values " +
      "((Select Platform_id from Platform where platform_name = ?), ?, ?, ?)",
       [platName, title, description, price], function (err, result, fields) {
      if (err) throw err;
    }); 
    }catch (err) {
      console.log((err));
      return res.status(500).send();
    }

    try{
      MySQL.query("Insert into cdkey (product_id, cdkey) values((select (max(product_ID)) from products), 'generated_key')",
         function (err, result, fields) {
        if (err) throw err;
        console.log("Data Inserted Successfully.");
      }); 
      }catch (err) {
        console.log((err));
        return res.status(500).send();
      }




    /*
    // assume that new value has the highest Product_ID Value
    MySQL.query("UPDATE products SET CDKey_ID = (SELECT MAX(Product_ID) FROM Products)" + 
      "WHERE Product_ID = (SELECT MAX(Product_ID) FROM Products)") ,function (err, result, fields) {
      if (err) throw err;
     console.log(result)};
     */


    res.json(productDoc);
  }

  if (method === 'PUT') {
    // Unfortunately, seem like the system can't update picture, or I've been missing something?
    const { title, description, price, images, platform, category, _id } = req.body;
    const oldInfo = await Product.findOne({ _id: _id}); // Get old product info
    const oldOne = JSON.parse(JSON.stringify(oldInfo));
    let oldPlatform = oldOne.platform; // get old platform_id
    const oldPlat = await Platform.findOne({_id:oldPlatform}); // get old platform info
    const newPlat = await Platform.findOne({_id:platform});

    let oldplat = JSON.parse(JSON.stringify(oldPlat));
    let newplat = JSON.parse(JSON.stringify(newPlat));

    let newPlatName = newplat.name;
    let oldName = oldOne.title;
    let oldDesc = oldOne.description;
    let oldPlatName = oldplat.name;
    let oldPrice = oldOne.price;

    // Update Method


    // Update with mysql
    MySQL.query("UPDATE products SET Platform_id = (SELECT Platform_id FROM platform WHERE Platform_name = ?)"
      + ", Product_name=?, Product_desc=?, Price=? WHERE Product_name =? AND Product_desc = ?"
      +" AND Platform_id =(SELECT Platform_id FROM Platform WHERE Platform_name = ?) AND Price = ?; ",
       [newPlatName, title, description, price, oldName, oldDesc, oldPlatName, oldPrice],
        function (err, result, fields) {
      if (err) throw err;
      console.log("Update Successful");
    }); 


    await Product.updateOne({ _id }, { title, description, price, platform, category });

    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      const result = await Product.findOne({_id: req.query.id});
      const resultJson = JSON.parse(JSON.stringify(result));
      let prodName = resultJson.title;
      let prodDesc = resultJson.description;
      let prodPlatID = resultJson.platform;
      let prodPrice = resultJson.price;
      const platformresult = await Platform.findOne({_id: prodPlatID});
      const platformResult = JSON.parse(JSON.stringify(platformresult));
      let prodPlatform;
      if (platformResult === null){
        MySQL.query("DELETE FROM products WHERE Product_name=? and Product_desc=? and Platform_ID is null and Price=?", 
        [prodName, prodDesc, prodPrice], function (err, result, fields) {
          if (err) throw err;
          console.log("Found Platform_id IS NULL");
        }); 
      }
      else
        {prodPlatform = platformResult.name;
        MySQL.query("DELETE FROM products WHERE Product_name=? and Product_desc=? and Platform_ID=(SELECT Platform_ID from platform where platform_name = ?)" + 
        " and Price=?", 
        [prodName, prodDesc, prodPlatform ,prodPrice], function (err, result, fields) {
          if (err) throw err;
          console.log("Deletion Success");
        }); 
      }

      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

// Function to generate a random CD key (you can customize this as needed)
async function generateCDKey() {
  return "generated_cd_key";
}
