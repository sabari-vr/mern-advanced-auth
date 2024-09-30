import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, CreditCard, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart, useManageProduct } from '../hooks';
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const { addToCartMutation } = useCart({ load: false })
    const { CartState: { cart } } = useCartScope()
    const { AppState: { user } } = useAppScope();


    const productByIdQuery = useQuery({
        queryKey: ["GET_PRODUCT_BY_ID"],
        queryFn: () => getProductsByID(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (!!productByIdQuery.data) {
            setProduct(productByIdQuery.data)
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

    const handleMouseMove = (e) => {
        if (isZoomed) {
            const { left, top, width, height } = e.target.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            setZoomPosition({ x, y });
        }
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
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

    if (productByIdQuery?.isLoading || !product) {
        return <LoadingSpinner />
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row">
                {/* Image Carousel */}
                <div className="md:w-1/2 relative">
                    <div
                        className="relative overflow-hidden cursor-zoom-in"
                        onMouseMove={handleMouseMove}
                        onClick={toggleZoom}
                    >
                        <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            className={`w-full h-auto ${isZoomed ? 'scale-150' : ''} transition-transform duration-300`}
                            style={isZoomed ? {
                                transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
                            } : {}}
                        />
                    </div>
                    <button
                        onClick={() => handleImageChange('prev')}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => handleImageChange('next')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
                    <p className="mb-4">{product.description}</p>

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
                        >
                            <CreditCard className="mr-2" size={20} />
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailView;