import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    platform: { type: mongoose.Types.ObjectId, ref: "Platform" },
    category: { type: Object },
    cdKeys: [
      {
        key: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);
