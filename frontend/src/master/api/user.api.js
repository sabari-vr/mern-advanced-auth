import { Axios } from "../../utils";

export const getAddress = async () => {
  const res = await Axios.get(`/user/address`);
  return res.data;
};

export const createAddres = async (payload) => {
  const res = await Axios.post(`/user/address`, payload);
  return res.data;
};

export const updateAddress = async ({ editingAddress, id }) => {
  const res = await Axios.put(`/user/address/${id}`, editingAddress);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await Axios.delete(`/user/address/${id}`);
  return res.data;
};
