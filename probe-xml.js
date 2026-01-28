
// Native fetch in Node 18+

async function runProbe() {
    const url = 'https://s1.cloudmu.id/listen/female_radio/stats?sid=1';
    console.log(`Probing ${url}...`);
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const text = await response.text();
        console.log(text);
    } catch (e) {
        console.error(e);
    }
}

runProbe();
