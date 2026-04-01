import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, uploadImage } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        gender: 'Men',
        category: 'Shoe',
        price: '',
        discountPrice: '',
        description: '',
        images: []
    });
    const [uploading, setUploading] = useState(false);

    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            navigate('/admin/products');
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
        } catch (error) {
            console.error('Upload failed', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                        <input type="number" name="discountPrice" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select name="gender" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                            <option value="Kids">Kids</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Shoe">Shoe</option>
                            <option value="Slipper">Slipper</option>
                            <option value="Sandal">Sandal</option>
                            <option value="Watch">Watch</option>
                            <option value="Perfume">Perfume</option>
                            <option value="Belt">Belt</option>
                            <option value="Shirt">Shirt</option>
                            <option value="Jacket">Jacket</option>
                            <option value="Tshirt">Tshirt</option>
                            <option value="Pants">Pants</option>
                            <option value="Joggers">Joggers</option>
                            <option value="Sunglasses">Sunglasses</option>
                            <option value="Socks">Socks</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" required rows="4" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div className="mt-2 flex items-center space-x-4">
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center">
                            <Upload className="w-5 h-5 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                        </label>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative">
                                <img src={img} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={createMutation.isPending} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                    {createMutation.isPending ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
