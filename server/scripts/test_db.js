const { Client } = require('pg');

async function testConnection(config, label) {
    const client = new Client(config);
    try {
        await client.connect();
        console.log(`✅ SUCCESS: [${label}] connected!`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ FAILED: [${label}] - ${err.message}`);
        return false;
    }
}

async function main() {
    const tests = [
        {
            label: "Current .env Config",
            user: 'web3radio',
            password: 'web3radio_local_dev',
            host: 'localhost',
            port: 5432,
            database: 'web3radio'
        },
        {
            label: "Postgres Default",
            user: 'postgres',
            password: 'password', // Common default
            host: 'localhost',
            port: 5432,
            database: 'postgres'
        },
        {
            label: "Postgres No Password",
            user: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'postgres'
        },
        {
            label: "Ubuntu Default User",
            user: 'kotarominami',
            host: 'localhost',
            port: 5432,
            database: 'postgres'
        }
    ];

    console.log("Starting Database Connection Diagnostics...\n");

    for (const test of tests) {
        if (await testConnection(test, test.label)) {
            console.log(`\n🎉 Found working config for ${test.label}!`);
            console.log(`Suggested DATABASE_URL: postgresql://${test.user}${test.password ? ':' + test.password : ''}@localhost:5432/${test.database}`);
            break;
        }
    }
}

main();
