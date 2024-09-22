import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "..";

export const useCategory = ({ category = null, load = false }) => {
  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCTS_BY_CATEGORY", category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category && load,
  });
  return {
    productListQuery,
  };
};
