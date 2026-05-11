const axios = require('axios');

async function testNewsletter() {
    try {
        const res = await axios.post('http://localhost:5001/api/newsletter/subscribe', {
            email: `test_${Date.now()}@example.com`
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testNewsletter();
