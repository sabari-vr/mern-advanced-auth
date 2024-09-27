import { Axios } from "../../utils";

export const getCart = async () => {
  const res = await Axios.get(`/cart`);
  return res.data;
};

export const addToCart = async (product) => {
  const res = await Axios.post(`/cart`, { productId: product._id });
  return res.data;
};

export const removeAllFromCart = async (productId) => {
  const res = await Axios.delete(`/cart`, {
    data: { productId },
  });
  return res.data;
};

export const updateQnty = async ({ id, quantity }) => {
  const res = await Axios.put(`/cart/${id}`, { quantity: quantity });
  return res.data;
};
