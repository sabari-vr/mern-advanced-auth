import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { Trash, Save, X, Plus, Upload } from "lucide-react";
import { useCategory } from '..';


const CategoryList = () => {
    const { categories,
        isLoading,
        handleAdd,
        handleSave,
        handleDelete,
        editingId,
        handleEdit,
        newCategoryName,
        setNewCategoryName,
        setEditingId,
        setEditName,
        editName,
        previewImages, setPreviewImages,
        previewImagesEdit, setPreviewImagesEdit
    } = useCategory({ load: true, category: null })

    useEffect(() => {
        if (!editingId) {
            setPreviewImagesEdit(false)
        }
    }, [editingId])

    const handleImagePreview = (event, isEdit = false) => {
        console.log(isEdit);

        const file = event.target.files[0];
        if (file) {
            const preview = { url: URL.createObjectURL(file), file: file };
            if (isEdit) {
                setPreviewImagesEdit((draft) => {
                    draft = [preview];
                    return draft;
                })
            } else {
                setPreviewImages((draft) => {
                    draft = [preview];
                    return draft;
                });
            }

        }
    };


    if (isLoading) return <div>Loading...</div>;

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className='min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Category
                        </th>

                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    <tr>
                        <td className='px-6 py-4 whitespace-nowrap'>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New category name"
                                className='bg-gray-700 text-white px-2 py-1 rounded'
                            />
                            <input
                                type="file"
                                id="image"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleImagePreview(e, false)}
                            />
                            <label
                                htmlFor="image"
                                className="cursor-pointer ms-2 bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                <Upload className="h-5 w-5 inline-block mr-2" />
                                Upload Images
                            </label>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <button onClick={handleAdd} className='text-green-400 hover:text-green-300 flex items-center'>
                                <Plus className='h-5 w-5 mr-2' /> Add Category
                            </button>
                        </td>
                    </tr>
                    {categories?.map((category) => (
                        <tr key={category._id} className='hover:bg-gray-700'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                {editingId === category._id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className='bg-gray-700 text-white px-2 py-1 rounded'
                                        />
                                        <input
                                            type="file"
                                            id="image2"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={(e) => handleImagePreview(e, true)}
                                        />
                                        <label
                                            htmlFor="image2"
                                            className="cursor-pointer ms-2 bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                        >
                                            <Upload className="h-5 w-5 inline-block mr-2" />
                                            Upload Images
                                        </label>
                                    </>
                                ) : (
                                    <div className='text-sm text-gray-300'>{category.name}</div>
                                )}
                                <div>
                                    <img style={{ height: "50px " }} src={editingId === category._id && !!previewImagesEdit ? previewImagesEdit[0].url : category.image} />
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                {editingId === category._id ? (
                                    <>
                                        <button onClick={handleSave} className='text-green-400 hover:text-green-300 mr-2'>
                                            <Save className='h-5 w-5' />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className='text-red-400 hover:text-red-300'>
                                            <X className='h-5 w-5' />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(category)} className='text-blue-400 hover:text-blue-300 mr-2'>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(category._id)} className='text-red-400 hover:text-red-300'>
                                            <Trash className='h-5 w-5' />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </motion.div>
    );
};

export default CategoryList;