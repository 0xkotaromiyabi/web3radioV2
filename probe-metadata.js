
// Native fetch in Node 18+

async function probeUrl(url) {
    // console.log(`Probing ${url}...`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/xml,application/json,text/html,*/*'
            }
        });
        console.log(`[${response.status}] ${url}`);
        const contentType = response.headers.get('content-type');
        console.log(`  Content-Type: ${contentType}`);

        const text = await response.text();
        console.log(`  Length: ${text.length}`);
        console.log(`  Snippet: ${text.substring(0, 200).replace(/\n/g, ' ')}`);
        return text;
    } catch (e) {
        console.error(`  Error: ${e.message}`);
        return null;
    }
}

async function runProbes() {
    const urls = [
        // Standard Shoutcast endpoints
        'https://s1.cloudmu.id/listen/female_radio/stats?sid=1', // XML usually
        'https://s1.cloudmu.id/listen/female_radio/stats?sid=1&json=1', // JSON usually
        'https://s1.cloudmu.id/listen/female_radio/index.html?sid=1', // User provided
        'https://s1.cloudmu.id/listen/female_radio/currentsong?sid=1' // Previous
    ];

    for (const url of urls) {
        await probeUrl(url);
    }
}

runProbes();
