import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import DatauriParser from "datauri/parser.js";

const parser = new DatauriParser();

const bufferToDataURI = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    let featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.data);
    const images = JSON.parse(req.body.images);
    const { name, description, price, category, size } = productData;

    const imageUrls = [];

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];

        const cloudinaryResponse = await cloudinary.uploader.upload(
          file.base64,
          {
            folder: "products",
          }
        );

        imageUrls.push(cloudinaryResponse.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: imageUrls,
      category,
      size,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = JSON.parse(req.body.data);
    const images = JSON.parse(req.body.images);
    const { name, description, price, category, size } = productData;

    const imageUrls = [];

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        if (file.url) {
          imageUrls.push(file.url);
        } else if (file.base64) {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            file.base64,
            {
              folder: "products",
            }
          );
          imageUrls.push(cloudinaryResponse.secure_url);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        category,
        size,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(async (imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log(`Deleted image from Cloudinary: ${imageUrl}`);
        } catch (error) {
          console.log(
            `Error deleting image from Cloudinary: ${imageUrl}`,
            error
          );
        }
      });

      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
