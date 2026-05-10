const mongoose = require('mongoose');
const Product = require('../models/Product');
const loadEnv = require('../config/loadEnv');

loadEnv();

const typoFixes = [
    { from: 'Balanciaga', to: 'Balenciaga' },
    { from: 'Jublie', to: 'Jubilee' },
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceAll = (value, from, to) => {
    if (typeof value !== 'string') return value;
    return value.replace(new RegExp(escapeRegExp(from), 'gi'), (match) => {
        if (match === match.toLowerCase()) return to.toLowerCase();
        if (match === match.toUpperCase()) return to.toUpperCase();
        return to;
    });
};

const fixProductTypos = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    let updated = 0;
    const query = {
        $or: typoFixes.flatMap(({ from }) => [
            { name: { $regex: from, $options: 'i' } },
            { slug: { $regex: from, $options: 'i' } },
        ]),
    };

    const products = await Product.find(query);

    for (const product of products) {
        let changed = false;

        for (const { from, to } of typoFixes) {
            const nextName = replaceAll(product.name, from, to);
            const nextSlug = replaceAll(product.slug, from, to);

            if (nextName !== product.name) {
                product.name = nextName;
                changed = true;
            }

            if (nextSlug !== product.slug) {
                product.slug = nextSlug;
                changed = true;
            }
        }

        if (changed) {
            await product.save();
            updated += 1;
        }
    }

    console.log(`Product typo fix complete. Updated ${updated} product${updated === 1 ? '' : 's'}.`);
};

fixProductTypos()
    .catch((error) => {
        console.error('Product typo fix failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
