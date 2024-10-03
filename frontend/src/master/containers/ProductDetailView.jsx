import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, CreditCard, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { getProductsByID } from '../api';
import { useAppScope, useCartScope } from '../context';
import { errorMessage } from '../../utils';

const ProductDetailView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [selectedSize, setSelectedSize] = useState(null);
    const [product, setProduct] = useState(false);
    const [related, setRelated] = useState([]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { addToCartMutation } = useCart({ load: false })
    const { CartState: { cart } } = useCartScope()
    const { AppState: { user } } = useAppScope();

    const productByIdQuery = useQuery({
        queryKey: ["GET_PRODUCT_BY_ID", id],
        queryFn: () => getProductsByID(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (!!productByIdQuery?.data?.product) {
            setProduct(productByIdQuery?.data?.product)
            setRelated(productByIdQuery?.data?.related)
        }
    }, [productByIdQuery.data])


    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleImageChange = (direction) => {
        if (direction === 'next') {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
            );
        } else {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
            );
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) return errorMessage('Please select a size')
        if (cartItem) return navigate('/cart')
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            return;
        } else {
            addToCartMutation.mutate({ product, size: selectedSize })
        }
    };

    const cartItem = cart.find((e) => e._id === product._id && e.size === selectedSize)

    const products = [{ productId: id, size: selectedSize, quantity: 1 }]
    const encodedProducts = encodeURIComponent(JSON.stringify(products));


    if (productByIdQuery?.isLoading || !product) {
        return <LoadingSpinner />
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row">
                {/* Image Carousel */}
                <div className="md:w-1/2 relative">
                    <div
                        className="relative overflow-hidden"
                    >
                        <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            className={`w-full h-auto  transition-transform duration-300`}
                            style={{ height: "500px", objectFit: "contain" }}
                        />
                        <button
                            onClick={() => handleImageChange('prev')}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                        >
                            <ChevronLeft size={24} color='black' />
                        </button>
                        <button
                            onClick={() => handleImageChange('next')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                        >
                            <ChevronRight size={24} color='black' />
                        </button>
                    </div>
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className="text-2xl font-semibold mb-4">₹ {product.price.toFixed(2)}</p>
                        <p className="text-xl font-semibold mb-4">{product.color}</p>
                    </div>

                    <div>
                        {/* Size Selection */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Colours:</h2>
                            <div className="flex space-x-2">
                                {related.length > 0 && related.map((e) => {
                                    return (
                                        <div onClick={() => navigate(`/product/${e.id}`)}><img className='h-[80px]' src={e.image} /><label>{e.label}</label></div>
                                    )
                                })}
                            </div>
                        </div>
                        {/* Size Selection */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Select Size:</h2>
                            <div className="flex space-x-2">
                                {Object.entries(product.size).map(([size, stock]) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeSelect(size)}
                                        className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-blue-500 text-white' : ''
                                            } ${stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={stock === 0}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart and Buy Now buttons */}
                        <div className="flex space-x-4">

                            <button
                                className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart size={22} className='mr-2' />
                                {cartItem ? "Go" : "Add"} to cart
                            </button>

                            <button
                                className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
                                disabled={!selectedSize}
                                onClick={() => navigate(`/order?products=${encodedProducts}`)}
                            >
                                <CreditCard className="mr-2" size={20} />
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='pt-5'>
                <pre className="mb-4" style={{ maxWidth: "100%", textWrap: "wrap" }}>{product.description}</pre>

            </div>
        </div>
    );
};

export default ProductDetailView;