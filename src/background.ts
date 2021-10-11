import { getToken } from "./queries/auth";

console.log("background page script");

async function getCurrentUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
}

const setIcon = async () => {
    const url = await getCurrentUrl();
    if (url) {
        const iconUrl = await getIconUrl(url);

        chrome.action.setIcon({ path: iconUrl }, () => {
            /* ... */
            console.log("icon set", iconUrl);
        });
    }
};

const getIconUrl = async (url: string): Promise<string> => {
    try {
        const token = await getToken();

        if (!token) {
            return "icons/icon-warning-64.png";
        }

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

chrome.tabs.onActivated.addListener((arg) => {
    console.log("onActivated", arg.tabId);
    setIcon();
});

chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    console.log("onUpdated", tabId, tab.url, tab.pendingUrl);
    setIcon();
});
