import React, { useState } from "react";
import {
  getProductsByCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "..";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useImmer } from "use-immer";
import { errorMessage } from "../../utils";

export const useCategory = ({ category = null, load = false }) => {
  const [editingId, setEditingId] = useState(null);
  const [previewImages, setPreviewImages] = useImmer(false);
  const [editName, setEditName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const queryClient = useQueryClient();

  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCTS_BY_CATEGORY", category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category && load,
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: load,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategoryName("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: editingId, name: editName });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAdd = async () => {
    // Check if previewImages is empty or not defined
    if (!previewImages || previewImages.length === 0) {
      return errorMessage("Image is mandatory");
    }

    // Check if newCategoryName is valid
    if (newCategoryName.trim()) {
      try {
        const formData = new FormData();

        // Append category name
        formData.append("data", JSON.stringify({ name: newCategoryName }));

        // Convert images to base64 format
        const base64Images = await Promise.all(
          previewImages.map(async (image) => {
            const base64 = await fileToBase64(image.file);
            return {
              name: image.file.name,
              type: image.file.type,
              base64: base64,
            };
          })
        );

        formData.append("images", JSON.stringify(base64Images));

        createMutation.mutate(formData);
      } catch (error) {
        console.error("Error adding category:", error);
        errorMessage("Failed to create category");
      }
    } else {
      errorMessage("Category name cannot be empty");
    }
  };

  return {
    productListQuery,
    categories,
    isLoading,
    handleAdd,
    handleSave,
    handleDelete,
    handleEdit,
    editingId,
    newCategoryName,
    setNewCategoryName,
    setEditingId,
    setEditName,
    editName,
    previewImages,
    setPreviewImages,
  };
};
