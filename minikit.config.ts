const ROOT_URL = "https://web3radio-v2.vercel.app";

export const minikitConfig = {
    accountAssociation: {
        "header": "",
        "payload": "",
        "signature": ""
    },
    miniapp: {
        version: "1",
        name: "Web3Radio",
        subtitle: "Decentralized Radio Station",
        description: "Listen to your favorite web3 radio stations",
        screenshotUrls: [`${ROOT_URL}/assets/web3radio-logo.png`],
        iconUrl: `${ROOT_URL}/assets/web3radio-logo.png`,
        splashImageUrl: `${ROOT_URL}/assets/web3radio-logo.png`,
        splashBackgroundColor: "#000000",
        homeUrl: ROOT_URL,
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "social",
        tags: ["music", "radio", "web3"],
        heroImageUrl: `${ROOT_URL}/assets/web3radio-logo.png`,
        tagline: "The Future of Radio",
        ogTitle: "Web3Radio",
        ogDescription: "Decentralized Radio Station",
        ogImageUrl: `${ROOT_URL}/assets/web3radio-logo.png`,
    },
} as const;
