import React, { useState } from "react";
import { motion } from "framer-motion";

export const StockTable = ({ stocks, balance, buyMutation }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const openModal = (stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedStock(null);
        setIsModalOpen(false);
        setQuantity(1)
    };
    return (
        <>
            <motion.table
                className="overflow-x-auto bg-white rounded-lg shadow-md mt-6 min-w-full table-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Symbol</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Price</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks?.map((stock, index) => (
                        <motion.tr
                            key={index}
                            className="border-t border-gray-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <td className="py-3 px-4 text-sm text-gray-600">
                                {stock.name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                                {stock.symbol}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                                ₹{stock.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                                <button
                                    className="bg-green-500 text-white px-4 py-1 rounded-md mr-2 hover:bg-green-600"
                                    onClick={() => openModal(stock)}
                                >
                                    Buy
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                                    onClick={() => handleSell(stock.symbol)}
                                >
                                    Sell
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>

            {isModalOpen && (
                <motion.div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">
                            Buy Stock: {selectedStock?.name}
                        </h2>
                        <p className="mb-4">Price: ₹{selectedStock?.price.toFixed(2)}</p>

                        {/* Input for Quantity */}
                        <div className="mb-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-500"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={() => handleBuy(selectedStock.symbol, quantity, selectedStock?.price.toFixed(2))}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}


        </>
    );

    function handleBuy(symbol, quantity, price) {
        if (price * quantity < balance) {
            console.log(`Buying ${quantity} units of stock: ${symbol} \n Total Price ${price * quantity}`);
            const payload = { quantity, symbol, price }
            buyMutation.mutate(payload)
            closeModal();
        } else {
            alert("insufficient balance")
        }
    }

    function handleSell(symbol) {
        console.log(`Selling stock: ${symbol}`);
    }
};

