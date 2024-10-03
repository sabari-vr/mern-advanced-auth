import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    batchId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    images: {
      type: Array,
      required: [true, "Image is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Object,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
