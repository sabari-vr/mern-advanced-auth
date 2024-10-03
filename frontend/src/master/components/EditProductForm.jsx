import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X } from "lucide-react";
import { useManageProduct } from '../hooks/useManageProduct';
import { useEffect } from "react";
import { useParams } from "react-router-dom";


const EditProductForm = () => {
    const { id } = useParams()
    const { updateProductMutation, newProduct, setNewProduct, previewImages, setPreviewImages, sizeStock, setSizeStock, categories, sizes } = useManageProduct({ productId: id, load: true });
    const { isPending: loading } = updateProductMutation;

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const { images, ...rest } = newProduct
            formData.append('data', JSON.stringify(rest));
            const base64Images = await Promise.all(
                previewImages.map(async (image) => {
                    if (image.file) {
                        const base64 = await fileToBase64(image.file);
                        return {
                            name: image.file.name,
                            type: image.file.type,
                            base64: base64
                        };
                    } else if (image.url) {
                        return {
                            name: image.url.split('/').pop(),
                            type: '',
                            url: image.url
                        };
                    }

                })
            );

            formData.append('images', JSON.stringify(base64Images));
            updateProductMutation.mutate({ id, formData });
        } catch {
            console.log("error updaing a product");
        }
    };

    const handleImagePreview = (event) => {
        const files = event.target.files;
        const previewList = [];
        for (let i = 0; i < files.length; i++) {
            previewList.push({ url: URL.createObjectURL(files[i]), file: files[i] });
        }
        setPreviewImages((draft) => {
            draft = [...draft, ...previewList]
            return draft
        });
    };

    const removeImage = (index) => {
        setPreviewImages((draft) => {
            draft = draft.filter((_, ind) => ind !== index);
            return draft
        });
    };

    const handleStockChange = (size, stock) => {
        setSizeStock((draft) => {
            draft[size] = stock;
        });
    };

    useEffect(() => {
        setNewProduct((draft) => {
            draft.size = sizeStock;
            return draft
        })
    }, [sizeStock])

    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-2xl font-semibold mb-6 text-emerald-300">Edit Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows="3"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step="0.01"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.length > 0 && categories?.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-300">
                        Colour
                    </label>
                    <input
                        type="text"
                        id="color"
                        name="color"
                        value={newProduct.color}
                        onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                        step="0.01"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="batchId" className="block text-sm font-medium text-gray-300">
                        Batch ID
                    </label>
                    <input
                        type="text"
                        id="batchId"
                        name="batchId"
                        value={newProduct.batchId}
                        onChange={(e) => setNewProduct({ ...newProduct, batchId: e.target.value })}
                        step="0.01"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Multi-image upload */}
                <div className="mt-1 flex items-center">
                    <input
                        type="file"
                        id="image"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleImagePreview}
                    />
                    <label
                        htmlFor="image"
                        className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <Upload className="h-5 w-5 inline-block mr-2" />
                        Upload Images
                    </label>
                </div>
                <div className="mt-1 flex items-center flex-wrap gap-4">
                    {previewImages?.map((e, index) => (
                        <div key={index} className="relative h-[100px] ">
                            <img className="h-[100px] " src={e.url} alt={`preview-${index}`} />
                            <X
                                className="absolute top-0 right-0 cursor-pointer text-red-500"
                                onClick={() => removeImage(index)}
                            />
                        </div>
                    ))}
                </div>

                {/* Stock for each size */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300">Stock by Size</label>
                    <div className=" flex items-center flex-wrap gap-4 ">
                        {sizes.map((size) => (
                            <div key={size} className="flex items-center mt-2 ">
                                <span className="text-white mr-3">{size}:</span>
                                <input
                                    type="number"
                                    value={sizeStock[size]}
                                    onChange={(e) => handleStockChange(size, e.target.value)}
                                    className="mt-1 block  w-[80px] bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Update Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default EditProductForm;
