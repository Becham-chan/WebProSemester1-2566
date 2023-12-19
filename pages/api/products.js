import { Product, CDKey } from "@/models/Product";
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
async function generateCDKey() {
  return "generated_cd_key";
}
