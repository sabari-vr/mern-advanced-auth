import toast from "react-hot-toast";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useAppScope, useCartScope } from "../context";
import { useCart } from "..";

const ProductCard = ({ product }) => {
    const { addToCartMutation, updateQuantityCartMutation, removeAllFromCartMutation } = useCart({ load: false })
    const { CartState: { cart } } = useCartScope()
    const { AppState: { user } } = useAppScope();

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            return;
        } else {
            addToCartMutation.mutate(product)
        }
    };

    const updateQuantity = (id, quantity) => {
        updateQuantityCartMutation.mutate({ id, quantity });
    };

    const cartItem = cart.find((e) => e._id === product._id)



    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                <img className='object-cover w-full' src={product.image} alt='product image' />
                <div className='absolute inset-0 bg-black bg-opacity-20' />
            </div>

            <div className='mt-4 px-5 pb-5'>
                <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                <div className='mt-2 mb-5 flex items-center justify-between'>
                    <p>
                        <span className='text-3xl font-bold text-emerald-400'>₹ {product.price}</span>
                    </p>
                </div>
                {!!cartItem ?
                    <div className='flex items-center justify-between sm:order-3'>
                        <div className='flex items-center gap-2'>
                            <button
                                className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                onClick={() => updateQuantity(cartItem._id, cartItem.quantity - 1)}
                            >
                                <Minus className='text-gray-300' />
                            </button>
                            <p>{cartItem.quantity}</p>
                            <button
                                className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                onClick={() => updateQuantity(cartItem._id, cartItem.quantity + 1)}
                            >
                                <Plus className='text-gray-300' />
                            </button>
                        </div>
                        <div className='text-right sm:w-32'>
                            <p className='text-base font-bold text-emerald-400'>₹ {cartItem.quantity > 0 ? cartItem.quantity * cartItem.price : cartItem.price}</p>
                        </div>
                    </div> :
                    <button
                        className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={22} className='mr-2' />
                        Add to cart
                    </button>
                }
            </div>
        </div>
    );
};
export default ProductCard;