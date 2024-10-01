import cloudinary from "../config/cloudinary.js";
import { Category } from "../models/category.model.js";

export const createCategory = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const images = JSON.parse(req.body.images);
  const { name } = data;

  try {
    const newCategory = new Category({ name });

    const file = images[0];

    const cloudinaryResponse = await cloudinary.uploader.upload(file.base64, {
      folder: "category",
    });

    newCategory.image = cloudinaryResponse.secure_url;
    await newCategory.save();
    res.status(201).json({
      msg: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    console.log("sab");

    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category by ID:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.status(200).json({ msg: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.status(200).json({ msg: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
