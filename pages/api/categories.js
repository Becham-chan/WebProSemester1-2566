import {Platform} from "@/models/Platform";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions, isAdminRequest} from "@/pages/api/auth/[...nextauth]";
import MySQL from "@/models/MySQL";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Platform.find().populate('parent'));
  }

  if (method === 'POST') {
    const {name,parentCategory,category} = req.body;
    const categoryDoc = await Platform.create({
      name,
      parent: parentCategory || undefined,
      category,
    });
    try{
      MySQL.query("INSERT INTO Platform (Platform_Name) values (?)",
         [name], function (err, result, fields) {
        if (err) throw err;
        console.log("Category insertion successful");
      }); 
      }catch (err) {
        console.log((err));
        return res.status(500).send();
      }
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const {name,parentCategory,category} = req.body;
    const oldPlatInfo = await Platform.findOne({_id: req.body._id});
    const oldJSON = JSON.parse(JSON.stringify(oldPlatInfo));
    let oldName = oldJSON.name;
    try{
      MySQL.query("UPDATE Platform SET Platform_Name = ? WHERE Platform_Name = ?",
         [name, oldName], function (err, result, fields) {
        if (err) throw err;
        console.log("Category updation successful");
      }); 
      }catch (err) {
        console.log(("Category updation failed"));
        return res.status(500).send();
      }

    const categoryDoc = await Platform.updateOne({_id: req.body._id},{
      name,
      parent: parentCategory || undefined,
      category,
    });
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    const platInfo = await Platform.findOne({_id, _id})
    const platJSON = JSON.parse(JSON.stringify(platInfo));
    let platName = platJSON.name;
    try{
      MySQL.query("Delete FROM Platform Where Platform_Name = ?",
         [platName], function (err, result, fields) {
        if (err) throw err;
        console.log("Category delete successful");
      }); 
      }catch (err) {
        console.log(("Category delete failed"));
        return res.status(500).send();
      }
    await Platform.deleteOne({_id});
    res.json('ok');
  }
}