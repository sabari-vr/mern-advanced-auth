import { Axios } from "../../utils";

export const createProduct = async (payload) => {
  const res = await Axios.post("/products", payload);
  return res.data;
};

export const getAllProducts = async () => {
  const res = await Axios.get("/products");
  return res.data;
};

export const deleteProductFn = async (id) => {
  const res = await Axios.delete(`/products/${id}`);
  return res.data;
};

export const toogleFeaturedProduct = async (id) => {
  const res = await Axios.patch(`/products/${id}`);
  return res.data;
};
