import { Product, CDKeys } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";


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

  // Generate CD keys
  const generatedCDKeys = await generateCDKeys(1);
  
  // Create the Product document with an array of CD key objects
  const productDoc = await Product.create({
    title,
    description,
    price,
    images,
    platform,
    category,
    cdKeys: generatedCDKeys.map((key) => ({ key })),
  });

  res.json(productDoc);
}
  

  if (method === 'PUT') {
    const { title, description, price, images, platform, category, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price, platform, category });
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

// Function to generate a random CD key (you can customize this as needed)
async function generateCDKeys(count) {
  const generatedKeys = [];
  for (let i = 0; i < count; i++) {
    generatedKeys.push("generated_cd_key");
  }
  return generatedKeys;
}
