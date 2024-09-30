import React, { useEffect } from "react";
import {
  createProduct,
  deleteProductFn,
  getAllProducts,
  toogleFeaturedProduct,
  updateProduct,
} from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { successMessage } from "../../utils";

export const useManageProduct = ({ productId = null }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const initalProductValue = {
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    size: false,
  };
  const categories = [
    "jeans",
    "t-shirts",
    "shoes",
    "glasses",
    "jackets",
    "suits",
    "bags",
  ];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [newProduct, setNewProduct] = useImmer(initalProductValue);
  const [previewImages, setPreviewImages] = useImmer([]);
  const [sizeStock, setSizeStock] = useImmer(
    sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  );

  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCT_LIST"],
    queryFn: getAllProducts,
    enabled: true,
  });

  useEffect(() => {
    if (productByIdQuery.data) {
      const { data } = productByIdQuery;
      if (!!data) {
        setNewProduct((draft) => {
          draft.name = data.name;
          draft.description = data.description;
          draft.price = data.price;
          draft.category = data.category;
          draft.size = data.size;
          return draft;
        });
      }
      const newImgFormat = data.images.map((element) => ({
        url: element,
        file: "",
      }));
      setPreviewImages((draft) => {
        draft = newImgFormat;
        return draft;
      });
      const sizes = data.size;

      setSizeStock(
        Object.keys(sizes).reduce(
          (acc, size) => ({
            ...acc,
            [size]: parseInt(sizes[size], 10),
          }),
          {}
        )
      );
    }
  }, [productByIdQuery.data]);

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      setNewProduct(initalProductValue);
      setPreviewImages([]);
      setSizeStock(sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}));
      successMessage(data.message);
      navigate("/secret-dashboard/products", { replace: true });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      setNewProduct(initalProductValue);
      setPreviewImages([]);
      setSizeStock(sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}));
      successMessage(data.message);
      navigate("/secret-dashboard/products", { replace: true });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_PRODUCT_LIST"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const tootleFeaturedProductMutation = useMutation({
    mutationFn: toogleFeaturedProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_PRODUCT_LIST"] });
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
    previewImages,
    setPreviewImages,
    productListQuery,
    sizeStock,
    setSizeStock,
    categories,
    sizes,
    updateProductMutation,
    productByIdQuery,
  };
};
