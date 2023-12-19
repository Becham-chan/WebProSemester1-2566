import {Platform} from "@/models/Platform";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions, isAdminRequest} from "@/pages/api/auth/[...nextauth]";

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
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const {name,parentCategory,category,_id} = req.body;
    const categoryDoc = await Platform.updateOne({_id},{
      name,
      parent: parentCategory || undefined,
      category,
    });
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Platform.deleteOne({_id});
    res.json('ok');
  }
}