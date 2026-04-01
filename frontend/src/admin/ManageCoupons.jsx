import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoupons, createCoupon, deleteCoupon } from '../api/coupons';
import { Trash2, Plus } from 'lucide-react';

const ManageCoupons = () => {
    const queryClient = useQueryClient();
    const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: '', expiryDate: '' });

    const { data: coupons, isLoading } = useQuery({
        queryKey: ['coupons'],
        queryFn: getCoupons
    });

    const createMutation = useMutation({
        mutationFn: createCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries(['coupons']);
            setNewCoupon({ code: '', discountPercentage: '', expiryDate: '' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries(['coupons']);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(newCoupon);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Manage Coupons</h2>

            {/* Create Coupon Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Add New Coupon</h3>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code</label>
                        <input
                            type="text"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 uppercase"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={newCoupon.discountPercentage}
                            onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            value={newCoupon.expiryDate}
                            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 h-10"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                    </button>
                </form>
            </div>

            {/* Coupons List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons?.map((coupon) => (
                            <tr key={coupon._id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{coupon.discountPercentage}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${new Date() > new Date(coupon.expiryDate) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {new Date() > new Date(coupon.expiryDate) ? 'Expired' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => deleteMutation.mutate(coupon._id)} className="text-red-600 hover:text-red-900 ml-4">
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

export default ManageCoupons;
