// createSubscriptionTiers.js
var con = require('../connection.js');

con.connect(function (err) {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log("Connected!");
    
    var sql = `
    CREATE TABLE IF NOT EXISTS subscription_tiers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        monthly_price DECIMAL(10,2) NOT NULL,
        features TEXT
    )`;
    
    con.query(sql, function (err, result) {
        if (err) {
            console.error('Error creating subscription_tiers table:', err);
            throw err;
        }
        console.log("Subscription_tiers table created successfully!");
        
        // Insert default tiers
        const tiers = [
            { name: 'basic', description: 'Basic gym access', monthly_price: 29.99, features: 'Access to gym equipment during standard hours' },
            { name: 'premium', description: 'Premium membership', monthly_price: 49.99, features: 'Extended hours access, 2 personal training sessions/month' },
            { name: 'vip', description: 'VIP membership', monthly_price: 79.99, features: '24/7 access, unlimited personal training, locker included' }
        ];
        
        tiers.forEach(tier => {
            con.query('INSERT IGNORE INTO subscription_tiers SET ?', tier);
        });
        
        con.end();
    });
});