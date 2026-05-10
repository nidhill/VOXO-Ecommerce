require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB');
        
        const updates = [
            { old: 'Shoe', new: 'Shoes' },
            { old: 'Slipper', new: 'Slippers' },
            { old: 'Sandal', new: 'Sandals' },
            { old: 'Watch', new: 'Watches' },
            { old: 'Perfume', new: 'Perfumes' },
            { old: 'Belt', new: 'Belts' },
            { old: 'Shirt', new: 'Shirts' },
            { old: 'Tshirt', new: 'T-Shirts' }
        ];

        for (const u of updates) {
            const res = await Product.updateMany({ category: u.old }, { $set: { category: u.new } });
            console.log(`Updated ${res.modifiedCount} products from ${u.old} to ${u.new}`);
        }
        
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
