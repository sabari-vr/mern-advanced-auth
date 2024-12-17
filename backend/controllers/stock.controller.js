import { Balance, Trade } from "../models/user.model.js";
import axios from "axios";

export const currentStockPriceBySymbol = async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: "Stock symbol is required" });
  }
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    );
    //   console.log(response.data.chart.result[0]);
    const price = response.data.chart.result[0].meta.regularMarketPrice;
    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
};

export const getLatestBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const balance = await Balance.findOne({ userId }).sort({ updatedAt: -1 });

    if (!balance) {
      return res
        .status(404)
        .json({ message: "Balance not found for the user." });
    }

    res.status(200).json({ balance: balance.balance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllStockPrice = async (req, res) => {
  const stockOptions = [
    { name: "State Bank of India", symbol: "SBIN.NS" },
    { name: "Reliance Industries", symbol: "RELIANCE.NS" },
    { name: "Tata Consultancy Services", symbol: "TCS.NS" },
    { name: "Infosys", symbol: "INFY.NS" },
    { name: "HDFC Bank", symbol: "HDFCBANK.NS" },
    { name: "ICICI Bank", symbol: "ICICIBANK.NS" },
    { name: "Bajaj Finance", symbol: "BAJFINANCE.NS" },
    { name: "Bharti Airtel", symbol: "BHARTIARTL.NS" },
    { name: "ITC", symbol: "ITC.NS" },
    { name: "Larsen & Toubro", symbol: "LT.NS" },
  ];
  try {
    const stockPrices = await Promise.all(
      stockOptions.map(async (stock) => {
        try {
          const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${stock.symbol}`
          );
          const price = response.data.chart.result[0].meta.regularMarketPrice;

          return {
            name: stock.name,
            symbol: stock.symbol,
            price,
            data: response.data.chart.result[0],
          };
        } catch (error) {
          console.error(`Failed to fetch price for ${stock.symbol}:`, error);
          return {
            name: stock.name,
            symbol: stock.symbol,
            price: null,
          };
        }
      })
    );

    res.status(200).json({ stocks: stockPrices });
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    res.status(500).json({ error: "Failed to fetch stock prices" });
  }
};

export const buyStock = async (req, res) => {
  const { quantity, symbol, price } = req.body;
  if (!quantity || !symbol || !price) {
    return res.status(400).json({ error: "Missing required parameters." });
  }
  try {
    const totalCost = quantity * parseFloat(price);

    const userBalance = await Balance.findOne({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    if (!userBalance) {
      return res.status(404).json({ error: "User balance not found." });
    }

    if (userBalance.balance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    const newTrade = new Trade({
      userId: req.user.id,
      quantity,
      stock: symbol,
      purchasePrice: parseFloat(price),
      transactionType: "Buy",
      status: "Holding",
    });
    await newTrade.save();

    const newBalanceAmount = userBalance.balance - totalCost;
    const newBalance = new Balance({
      userId: req.user.id,
      balance: newBalanceAmount,
    });
    await newBalance.save();

    return res.status(200).json({
      message: "Stock purchased successfully.",
      trade: newTrade,
      newBalance: newBalanceAmount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to complete the transaction." });
  }
};

export const getHoldingStocks = async (req, res) => {
  const userId = req.user.id;

  try {
    const holdingStocks = await Trade.find({
      userId: userId,
      transactionType: "Buy",
      status: "Holding",
    }).select("-__v");

    if (holdingStocks.length === 0) {
      return res.status(404).json({ message: "No holding stocks found." });
    }

    return res.status(200).json(holdingStocks);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve holding stocks." });
  }
};

export const getCompletedStocks = async (req, res) => {
  const userId = req.user.id;

  try {
    const holdingStocks = await Trade.find({
      userId: userId,
      transactionType: "Buy",
      status: "Complete",
    }).select("-__v");

    if (holdingStocks.length === 0) {
      return res.status(404).json({ message: "No complete stocks found." });
    }

    return res.status(200).json(holdingStocks);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve holding stocks." });
  }
};

export const exitTrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { _id, currentPrice } = req.body;

    const trade = await Trade.findOne({ _id, userId });
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    const userBalance = await Balance.findOne({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    const profitOrLoss = currentPrice - trade.purchasePrice;
    const totalProfitOrLoss = profitOrLoss * trade.quantity;
    trade.status = "Complete";
    trade.profitOrLoss = totalProfitOrLoss;
    trade.sellDate = new Date();

    await trade.save();

    const newBalanceAmount = userBalance.balance + totalProfitOrLoss;
    const newBalance = new Balance({
      userId: req.user.id,
      balance: newBalanceAmount,
    });
    await newBalance.save();

    res.status(200).json({
      message: "Trade exited successfully",
      trade,
    });
  } catch (error) {
    console.error("Error exiting trade:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
