import React, { useState } from "react";
import {
  createProduct,
  deleteProductFn,
  getAllProducts,
  toogleFeaturedProduct,
} from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useManageProduct = () => {
  const queryClient = useQueryClient();
  const initalProductValue = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  };
  const [newProduct, setNewProduct] = useState(initalProductValue);

  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCT_LIST"],
    queryFn: getAllProducts,
    enabled: true,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      setNewProduct(initalProductValue);
      successMessage(data.message);
      queryClient.invalidateQueries(["GET_PRODUCT_LIST"]);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["GET_PRODUCT_LIST"]);
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const tootleFeaturedProductMutation = useMutation({
    mutationFn: toogleFeaturedProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["GET_PRODUCT_LIST"]);
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteProduct = (id) => {
    deleteProductMutation.mutate(id);
  };
  const toggleFeaturedProduct = (id) => {
    tootleFeaturedProductMutation.mutate(id);
  };

  return {
    createProductMutation,
    newProduct,
    setNewProduct,
    deleteProduct,
    toggleFeaturedProduct,
    productListQuery,
  };
};
