
// Native fetch in Node 18+
async function testMetadata() {
    const url = 'https://s1.cloudmu.id/listen/female_radio/currentsong?sid=1';
    console.log(`Fetching ${url}...`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        const text = await response.text();
        console.log('Body:', text);
        console.log('Body length:', text.length);
        // show hex to see hidden chars
        console.log('Body bytes:', Buffer.from(text).toString('hex'));
    } catch (e) {
        console.error('Error:', e);
    }
}

testMetadata();
