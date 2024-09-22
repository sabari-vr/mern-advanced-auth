import { Axios } from "../../utils";

export const getProductsByCategory = async (category) => {
  const res = await Axios.get(`/products/category/${category}`);
  return res.data;
};
