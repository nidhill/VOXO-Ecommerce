const mongoose = require('mongoose');
const Product = require('../models/Product');
const loadEnv = require('../config/loadEnv');

loadEnv();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    const genders = ['Men', 'Women'];
    const categories = [
        'Shoe', 'Slipper', 'Sandal', 'Watch', 'Perfume', 'Belt', 'Shirt',
        'Jacket', 'Tshirt', 'Pants', 'Joggers', 'Sunglasses', 'Socks'
    ];

    // Placeholder images from Unsplash (generic)
    const images = {
        Shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        Slipper: 'https://images.unsplash.com/photo-1562183241-b937e95585b6',
        Sandal: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
        Watch: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
        Perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601',
        Belt: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        Shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
        Jacket: 'https://images.unsplash.com/photo-1551028919-ac7f2ca3b2b4',
        Tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        Pants: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80',
        Joggers: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea',
        Sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
        Socks: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82'
    };

    const products = [];

    for (const gender of genders) {
        for (const category of categories) {
            // Create 3 products for each combo
            for (let i = 1; i <= 3; i++) {
                products.push({
                    name: `${gender}'s ${category} ${i}`,
                    gender: gender,
                    category: category,
                    price: Math.floor(Math.random() * 100) + 20,
                    description: `This is a high quality ${gender}'s ${category}. Perfect for any occasion.`,
                    images: [images[category] + '?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
                    isHidden: false
                });
            }
        }
    }

    try {
        await Product.deleteMany({}); // Clear existing
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
