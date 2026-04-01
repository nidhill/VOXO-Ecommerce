import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '../api/products';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
    const queryClient = useQueryClient();
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts()
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Products</h2>
                <Link to="/admin/add-product" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id || product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/40'}
                                        alt={product.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40'; }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => deleteMutation.mutate(product._id)} className="text-red-600 hover:text-red-900 ml-4">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;
