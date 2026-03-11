const db = require('./db');
async function test() {
    try {
        const name = 'jhdcji';
        const key = ',nc';
        const provider = 'nmc';
        const expiryDate = '03/12/2026';
        const finalStatus = 'Valid';

        const [result] = await db.query(
            'INSERT INTO licenses (name, license_key, provider_name, expiry_date, status) VALUES (?, ?, ?, ?, ?)',
            [name, key, provider, expiryDate, finalStatus]
        );
        console.log('Success:', result);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}
test();
