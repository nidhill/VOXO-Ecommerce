const path = require('path');
const dotenv = require('dotenv');

let isLoaded = false;

function loadEnv() {
    if (isLoaded) {
        return;
    }

    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    isLoaded = true;
}

module.exports = loadEnv;
