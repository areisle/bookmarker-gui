import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG!));
const auth = getAuth();

async function getCurrentUrl() {
    const [tab] = await global.browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    return tab.url;
}

const setIcon = async () => {
    const url = await getCurrentUrl();
    const token = await auth.currentUser?.getIdToken();
    if (url) {
        const iconUrl = await getIconUrl(token, url);
        await global.browser.browserAction.setIcon({ path: iconUrl });
    }
};

const getIconUrl = async (
    token: string | undefined,
    url: string
): Promise<string> => {
    if (!token || !url) {
        return "icons/icon-warning-64.png";
    }

    try {
        const response = await fetch(process.env.API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ?? "",
            },
            body: JSON.stringify({
                query: `
                    query isBookmarked($url: String!) {
                        isBookmarked(url: $url)
                    }
                `,
                variables: { url },
            }),
        });

        const result = await response.json();

        if (result.errors?.[0]?.extensions?.code === "UNAUTHENTICATED") {
            return "icons/icon-warning-64.png";
        }

        if (result.data.isBookmarked) {
            return "icons/icon-bookmarked-64.png";
        }

        return "icons/icon-unbookmarked-64.png";
    } catch (e) {
        console?.log("error getting is bookmarked", e);
    }

    return "icons/icon-warning-64.png";
};

global.browser.tabs.onActivated.addListener((arg) => {
    setIcon();
});

global.browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    setIcon();
});

onAuthStateChanged(auth, async (user) => {
    setIcon();
});
