
// Native fetch in Node 18+

async function runProbes() {
    const url = 'https://s1.cloudmu.id/listen/female_radio/stats?sid=1&json=1';
    console.log(`Probing ${url}...`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });
        const json = await response.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (e) {
        console.error(e);
    }
}

runProbes();
