import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buyStock,
  exitTrade,
  getAllStockPrice,
  getCuttentAccountBalance,
  getMyCompleteA,
  getMyHolding,
} from "..";
import { errorMessage, successMessage } from "../../utils";
import { useImmer } from "use-immer";

export const useStock = ({ load = false }) => {
  const [myHolding, setMyHolding] = useImmer([]);
  const queryClient = useQueryClient();
  const balance = useQuery({
    queryKey: ["MY-BALANCE"],
    queryFn: getCuttentAccountBalance,
    enabled: load,
  });

  const getAllSymbolPrice = useQuery({
    queryKey: ["ALL-STOCK"],
    queryFn: getAllStockPrice,
    enabled: load,
    refetchInterval: 5000,
  });

  const getMyHoldings = useQuery({
    queryKey: ["MY-HOLDING"],
    queryFn: getMyHolding,
    enabled: load,
  });

  const getMyComplete = useQuery({
    queryKey: ["MY-COMPLETE"],
    queryFn: getMyCompleteA,
    enabled: load,
  });

  const buyMutation = useMutation({
    mutationFn: buyStock,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["MY-BALANCE"]);
      queryClient.invalidateQueries(["MY-HOLDING"]);
    },
    onError: (e) => {
      //   errorMessage(e.response.data.message);
    },
  });

  const exitMutation = useMutation({
    mutationFn: exitTrade,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["MY-BALANCE"]);
      queryClient.invalidateQueries(["MY-HOLDING"]);
      queryClient.invalidateQueries(["MY-COMPLETE"]);
      successMessage("trade exited successfuly");
    },
    onError: (e) => {
      //   errorMessage(e.response.data.message);
    },
  });

  useEffect(() => {
    if (
      getMyHoldings?.data?.length > 0 &&
      getAllSymbolPrice?.data?.stocks?.length > 0
    ) {
      setMyHolding((draft) => {
        draft.length = 0;
        getMyHoldings.data.forEach((holding) => {
          const currentSymbol = getAllSymbolPrice?.data?.stocks.find(
            (stock) => stock.symbol === holding.stock
          );
          draft.push({
            ...holding,
            currentPrice: currentSymbol?.price || null,
          });
        });
      });
    }
  }, [getMyHoldings?.data, getAllSymbolPrice?.data]);

  return {
    balance: balance?.data,
    getAllSymbolPrice: getAllSymbolPrice?.data,
    getMyHolding: myHolding,
    getMyComplete: getMyComplete?.data,
    buyMutation,
    exitMutation,
  };
};
