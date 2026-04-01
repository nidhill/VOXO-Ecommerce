<<<<<<< HEAD
export const products = [
    // --- MEN'S SHOES ---
    {
        id: 1,
        name: 'Classic White Sneakers',
        price: 89,
        formattedPrice: '$89',
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop'],
        category: 'Shoe',
        gender: 'Men',
        tag: 'Best Seller',
        description: 'Timeless white sneakers for everyday wear.',
        details: ['Leather Upper', 'Rubber Sole', 'Breathable']
    },
    // --- MEN'S SLIPPERS ---
    {
        id: 20,
        name: 'Comfy Home Slippers',
        price: 25,
        formattedPrice: '$25',
        images: ['https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=800&auto=format&fit=crop'],
        category: 'Slipper',
        gender: 'Men',
        tag: 'Cozy',
        description: 'Soft and warm slippers for relaxing at home.',
        details: ['Fleece Lining', 'Non-slip Sole']
    },
    // --- MEN'S SANDALS ---
    {
        id: 21,
        name: 'Leather Sandals',
        price: 45,
        formattedPrice: '$45',
        images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&auto=format&fit=crop'],
        category: 'Sandal',
        gender: 'Men',
        tag: 'Summer',
        description: 'Durable leather sandals for summer walks.',
        details: ['Genuine Leather', 'Cushioned Footbed']
    },
    // --- MEN'S WATCHES ---
    {
        id: 5,
        name: 'Luxury Chronograph',
        price: 250,
        formattedPrice: '$250',
        images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop'],
        category: 'Watch',
        gender: 'Men',
        tag: 'Premium',
        description: 'A sophisticated chronograph watch for men.',
        details: ['Stainless Steel', 'Water Resistant', 'Quartz Movement']
    },
    // --- MEN'S PERFUME ---
    {
        id: 22,
        name: 'Ocean Breeze Cologne',
        price: 60,
        formattedPrice: '$60',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop'],
        category: 'Perfume',
        gender: 'Men',
        tag: 'Fresh',
        description: 'A refreshing aquatic fragrance.',
        details: ['100ml', 'Eau de Toilette']
    },
    // --- MEN'S BELTS ---
    {
        id: 11,
        name: 'Leather Belt',
        price: 40,
        formattedPrice: '$40',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
        category: 'Belt',
        gender: 'Men',
        tag: '',
        description: 'Genuine leather belt.',
        details: ['Leather', 'Silver Buckle', 'Adjustable']
    },
    // --- MEN'S SHIRTS ---
    {
        id: 7,
        name: 'Oxford Button-Down',
        price: 55,
        formattedPrice: '$55',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'],
        category: 'Shirt',
        gender: 'Men',
        tag: 'Essential',
        description: 'Classic Oxford shirt, perfect for work or casual wear.',
        details: ['100% Cotton', 'Regular Fit', 'Machine Washable']
    },
    // --- MEN'S JACKETS ---
    {
        id: 23,
        name: 'Bomber Jacket',
        price: 85,
        formattedPrice: '$85',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'],
        category: 'Jacket',
        gender: 'Men',
        tag: 'Fall',
        description: 'Stylish bomber jacket.',
        details: ['Polyester', 'Ribbed Cuffs', 'Zip Closure']
    },
    // --- MEN'S T-SHIRTS ---
    {
        id: 24,
        name: 'Essential Crew Neck',
        price: 20,
        formattedPrice: '$20',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'],
        category: 'Tshirt',
        gender: 'Men',
        tag: 'Basic',
        description: 'Soft cotton crew neck t-shirt.',
        details: ['100% Cotton', 'Regular Fit']
    },
    // --- MEN'S PANTS ---
    {
        id: 9,
        name: 'Slim Fit Chinos',
        price: 60,
        formattedPrice: '$60',
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'],
        category: 'Pants',
        gender: 'Men',
        tag: '',
        description: 'Versatile chinos for any outfit.',
        details: ['Cotton Blend', 'Stretch Fabric', 'Slim Fit']
    },
    // --- MEN'S JOGGERS ---
    {
        id: 25,
        name: 'Fleece Joggers',
        price: 45,
        formattedPrice: '$45',
        images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop'],
        category: 'Joggers',
        gender: 'Men',
        tag: 'Sport',
        description: 'Comfortable joggers for workouts or lounging.',
        details: ['Cotton Fleece', 'Elastic Waistband']
    },
    // --- MEN'S SUNGLASSES ---
    {
        id: 12,
        name: 'Aviator Sunglasses',
        price: 130,
        formattedPrice: '$130',
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'],
        category: 'Sunglasses',
        gender: 'Men',
        tag: 'Classic',
        description: 'Timeless aviator style sunglasses.',
        details: ['UV Protection', 'Metal Frame', 'Tinted Lenses']
    },
    // --- MEN'S SOCKS ---
    {
        id: 26,
        name: 'Cotton Crew Socks',
        price: 15,
        formattedPrice: '$15',
        images: ['https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop'],
        category: 'Socks',
        gender: 'Men',
        tag: 'Multi-pack',
        description: 'Pack of 3 comfortable crew socks.',
        details: ['Cotton Blend', 'Cushioned Sole']
    },

    // --- WOMEN'S SHOES ---
    {
        id: 4,
        name: 'High Heels',
        price: 95,
        formattedPrice: '$95',
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'],
        category: 'Shoe',
        gender: 'Women',
        tag: 'Sale',
        description: 'Elegant high heels for formal occasions.',
        details: ['Suede Finish', '3-inch Heel', 'Comfort Fit']
    },
    // --- WOMEN'S SLIPPERS ---
    {
        id: 27,
        name: 'Faux Fur Slippers',
        price: 30,
        formattedPrice: '$30',
        images: ['https://images.unsplash.com/photo-1569388330292-79cc1ec67270?q=80&w=800&auto=format&fit=crop'],
        category: 'Slipper',
        gender: 'Women',
        tag: 'Soft',
        description: 'Luxuriously soft faux fur slippers.',
        details: ['Faux Fur', 'Rubber Sole']
    },
    // --- WOMEN'S SANDALS ---
    {
        id: 28,
        name: 'Strappy Sandals',
        price: 50,
        formattedPrice: '$50',
        images: ['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop'],
        category: 'Sandal',
        gender: 'Women',
        tag: 'Summer',
        description: 'Chic strappy sandals.',
        details: ['Leather Straps', 'Flat Sole']
    },
    // --- WOMEN'S WATCHES ---
    {
        id: 6,
        name: 'Rose Gold Minimalist',
        price: 180,
        formattedPrice: '$180',
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'],
        category: 'Watch',
        gender: 'Women',
        tag: '',
        description: 'Minimalist design for the modern woman.',
        details: ['Rose Gold Plated', 'Leather Strap', 'Analog']
    },
    // --- WOMEN'S PERFUME ---
    {
        id: 10,
        name: 'Floral Essence',
        price: 85,
        formattedPrice: '$85',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'],
        category: 'Perfume',
        gender: 'Women',
        tag: 'New',
        description: 'A fresh and floral signature scent.',
        details: ['Eau de Parfum', '50ml', 'Long-lasting']
    },
    // --- WOMEN'S BELTS ---
    {
        id: 29,
        name: 'Skinny Leather Belt',
        price: 35,
        formattedPrice: '$35',
        images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop'],
        category: 'Belt',
        gender: 'Women',
        tag: '',
        description: 'Thin belt to accent your waist.',
        details: ['Leather', 'Gold Buckle']
    },
    // --- WOMEN'S SHIRTS ---
    {
        id: 30,
        name: 'Silk Blouse',
        price: 90,
        formattedPrice: '$90',
        images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=800&auto=format&fit=crop'],
        category: 'Shirt',
        gender: 'Women',
        tag: 'Elegant',
        description: 'Elegant silk blouse for work or evening.',
        details: ['100% Silk', 'Relaxed Fit']
    },
    // --- WOMEN'S JACKETS ---
    {
        id: 8,
        name: 'Denim Jacket',
        price: 75,
        formattedPrice: '$75',
        images: ['https://images.unsplash.com/photo-1551028919-ac7f2ca3b2b4?q=80&w=800&auto=format&fit=crop'],
        category: 'Jacket',
        gender: 'Women',
        tag: 'Cool',
        description: 'Vintage style denim jacket.',
        details: ['Denim', 'Oversized Fit', 'Button Closure']
    },
    // --- WOMEN'S T-SHIRTS ---
    {
        id: 31,
        name: 'V-Neck Tee',
        price: 25,
        formattedPrice: '$25',
        images: ['https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop'],
        category: 'Tshirt',
        gender: 'Women',
        tag: 'Basic',
        description: 'Soft v-neck t-shirt.',
        details: ['Cotton Modal', 'Slim Fit']
    },
    // --- WOMEN'S PANTS ---
    {
        id: 32,
        name: 'Wide Leg Trousers',
        price: 70,
        formattedPrice: '$70',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop'],
        category: 'Pants',
        gender: 'Women',
        tag: 'Trendy',
        description: 'High-waisted wide leg trousers.',
        details: ['Polyester Blend', 'Pleated Front']
    },
    // --- WOMEN'S JOGGERS ---
    {
        id: 33,
        name: 'Yoga Joggers',
        price: 55,
        formattedPrice: '$55',
        images: ['https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800&auto=format&fit=crop'],
        category: 'Joggers',
        gender: 'Women',
        tag: 'Active',
        description: 'Stretchy joggers for yoga or lounging.',
        details: ['Nylon Spandex', 'High Waist']
    },
    // --- WOMEN'S SUNGLASSES ---
    {
        id: 34,
        name: 'Cat Eye Sunglasses',
        price: 110,
        formattedPrice: '$110',
        images: ['https://images.unsplash.com/photo-1570222094114-2819cd98731e?q=80&w=800&auto=format&fit=crop'],
        category: 'Sunglasses',
        gender: 'Women',
        tag: 'Chic',
        description: 'Retro cat eye sunglasses.',
        details: ['UV Protection', 'Plastic Frame']
    },
    // --- WOMEN'S SOCKS ---
    {
        id: 35,
        name: 'Ankle Socks',
        price: 12,
        formattedPrice: '$12',
        images: ['https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=800&auto=format&fit=crop'],
        category: 'Socks',
        gender: 'Women',
        tag: '',
        description: 'Low cut ankle socks.',
        details: ['Cotton Blend', 'Breathable']
    }
];
=======
export const products = [];
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
