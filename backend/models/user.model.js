import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" },
  },
  { timestamps: true }
);

const balanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    balance: {
      type: Number,
      required: true,
      default: 100000,
      min: 0,
    },
  },
  { timestamps: true }
);

const tradeSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    sellDate: {
      type: Date,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    stock: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionType: {
      type: String,
      enum: ["Buy", "Sell"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Holding", "Complete"],
      required: true,
    },
    profitOrLoss: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
export const Token = mongoose.model("Token", tokenSchema);
export const Balance = mongoose.model("Balance", balanceSchema);
export const Trade = mongoose.model("Trade", tradeSchema);
