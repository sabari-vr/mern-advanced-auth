import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, removeAllFromCart, updateQnty } from "..";
import { successMessage } from "../../utils";

export const useCart = () => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["GET_CART"]);
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateQuantityCartMutation = useMutation({
    mutationFn: updateQnty,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["GET_CART"]);
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const removeAllFromCartMutation = useMutation({
    mutationFn: removeAllFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["GET_CART"]);
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  return {
    addToCartMutation,
    updateQuantityCartMutation,
    removeAllFromCartMutation,
  };
};
