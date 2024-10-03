import React from 'react';
import { Link } from 'react-router-dom';

export const OrderPlaced = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className=" p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-green-500">Order Placed Successfully!</h1>
                <p className="mt-4 text-white-600">Thank you for your purchase. Your order has been placed.</p>

                <Link to="/orders"
                    className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                    View Your Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderPlaced;
