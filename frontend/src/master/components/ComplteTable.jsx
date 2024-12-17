import React from "react";
import { motion } from "framer-motion";

export const ComplteTable = ({ stocks, exitMutation }) => {

  const profitOrLoss = (purchasePrice, currentPrice, quantity) => {
    const difference = (currentPrice - purchasePrice) * quantity;
    return difference.toFixed(2);
  }

  function formatDateToDDMMYYYY(isoDate) {
    const date = new Date(isoDate); // Convert the ISO string to a Date object
    const day = String(date.getDate()).padStart(2, '0'); // Extract and pad day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Extract and pad month
    const year = date.getFullYear(); // Extract year

    return `${day}-${month}-${year}`; // Format as dd-mm-yyyy
  }

  return (
    <motion.table
      className="overflow-x-auto bg-white rounded-lg shadow-md mt-6 min-w-full table-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
            Stock
          </th>
          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
            Quantity
          </th>
          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
            Purchase On
          </th>
          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
            Purchase Price
          </th>
          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
            Profit / loss
          </th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <motion.tr
            key={stock._id}
            className="border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <td className="py-3 px-4 text-sm text-gray-600">{stock.stock}</td>
            <td className="py-3 px-4 text-sm text-gray-600">
              {stock.quantity}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">
              {formatDateToDDMMYYYY(stock.createdAt)}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600">
              ₹{stock.purchasePrice.toFixed(2)}
            </td>
            <td
              className={`py-3 px-4 text-sm ${stock.profitOrLoss < 0
                ? "text-red-600"
                : "text-green-600"
                }`}
            >
              ₹{stock.profitOrLoss.toFixed(2)}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  );
};
