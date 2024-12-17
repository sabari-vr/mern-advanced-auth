import { Axios } from "../../utils";

export const getCuttentAccountBalance = async () => {
  const res = await Axios.get("/stock/balance");
  return res.data;
};

export const getAllStockPrice = async () => {
  const res = await Axios.get("/stock/all-stock-price");
  return res.data;
};

export const buyStock = async (payload) => {
  const res = await Axios.post("/stock/buy", payload);
  return res.data;
};

export const getMyHolding = async () => {
  const res = await Axios.get("/stock/my-holding");
  return res.data;
};

export const getMyCompleteA = async () => {
  const res = await Axios.get("/stock/my-complete");
  return res.data;
};

export const exitTrade = async (payload) => {
  const res = await Axios.post("/stock/exit-trade", payload);
  return res.data;
};
