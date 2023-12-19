import mongoose, { model, Schema, models } from "mongoose";

// Define a CDKey schema
const CDKeySchema = new Schema({
  key: { type: String, unique: true, required: true },
});

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

ProductSchema.pre("save", async function (next) {
  // Generate CD keys for the product
  const generatedKeys = await generateCDKeys(1); // You can specify the number of keys to generate

  // Create CDKey documents and associate them with the product
  const cdKeyDocs = generatedKeys.map((key) => ({ key, product: this._id }));
  const savedCDKeys = await CDKeys.create(cdKeyDocs);

  // Add the generated CD keys to the product
  this.cdKeys = savedCDKeys.map((cdKey) => cdKey._id);

  next();
});

async function generateCDKeys(count) {
  const generatedKeys = [];
  for (let i = 0; i < count; i++) {
    generatedKeys.push("generated_cd_key");
  }
  return generatedKeys;
}

export const Product = models.Product || model("Product", ProductSchema);
export const CDKeys = models.CDKeys || model("CDKeys", CDKeySchema);
