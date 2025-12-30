const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@database:5432/saas_db'
    });

    try {
        await client.connect();
        console.log("Connected to database. Starting migrations...");

        const migrationFiles = [
            '001_create_tenants.sql',
            '002_create_users.sql',
            '003_create_projects.sql',
            '004_create_tasks.sql',
            '005_create_audit_logs.sql'
        ];

        for (const file of migrationFiles) {
            console.log(`Executing migration: ${file}`);
            let sql = fs.readFileSync(path.join(__dirname, '../migrations', file), 'utf8');
            
            // THE FIX: Remove the invisible Byte Order Mark (BOM)
            sql = sql.replace(/^\uFEFF/, ''); 
            
            await client.query(sql);
        }

        console.log("Running seeds...");
        const seedPath = path.join(__dirname, '../seeds/seed_data.sql');
        
        if (fs.existsSync(seedPath)) {
            let seedSql = fs.readFileSync(seedPath, 'utf8');
            seedSql = seedSql.replace(/^\uFEFF/, ''); // Apply fix to seeds too
            await client.query(seedSql);
        }

        console.log("Database initialized successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exit(1);
    }
}

run();