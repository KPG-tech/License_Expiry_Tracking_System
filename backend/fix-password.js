const bcrypt = require('bcryptjs');
const db = require('./db');

async function fixPassword() {
    try {
        const newHash = await bcrypt.hash('admin123', 10);
        await db.query('UPDATE users SET password = ? WHERE username = "admin"', [newHash]);
        console.log('Password hash updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixPassword();
