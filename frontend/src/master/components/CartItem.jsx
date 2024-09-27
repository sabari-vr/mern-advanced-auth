import { Minus, Plus, Trash } from "lucide-react";

const CartItem = ({ item, updateQuantityM, removeAllFromCartM }) => {

    const removeFromCart = (productId) => {
        removeAllFromCartM.mutate(productId)
    };
    const updateQuantity = (id, quantity) => {
        updateQuantityM.mutate({ id, quantity });
    };

    return (
        <div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 sm:p-6'>
            <div className='space-y-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:space-y-0'>
                <div className='flex items-center justify-between sm:order-1 w-full'>
                    <div className='shrink-0'>
                        <img className='h-16 sm:h-32 rounded object-cover' src={item.image} />
                    </div>
                    <div className='flex-1 ml-4 min-w-0'>
                        <p className='text-base font-medium text-white hover:text-emerald-400 hover:underline truncate'>
                            {item.name}
                        </p>
                    </div>
                    <button
                        className='inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline'
                        onClick={() => removeFromCart(item._id)}
                    >
                        <Trash />
                    </button>
                </div>

                <div className='flex items-center justify-between sm:order-3'>
                    <div className='flex items-center gap-2'>
                        <button
                            className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                            <Minus className='text-gray-300' />
                        </button>
                        <p>{item.quantity}</p>
                        <button
                            className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                            <Plus className='text-gray-300' />
                        </button>
                    </div>

                    <div className='text-right sm:w-32'>
                        <p className='text-base font-bold text-emerald-400'>₹ {item.quantity > 0 ? item.quantity * item.price : item.price}</p>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default CartItem;