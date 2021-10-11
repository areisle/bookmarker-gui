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
        const token = await getToken();
        let iconUrl = "icons/icon-warning-64.png";
        if (token) {
            iconUrl = "icons/icon-unbookmarked-64.png";
        }

        chrome.action.setIcon({ path: iconUrl }, () => {
            /* ... */
            console.log("icon set", iconUrl);
        });
    }
};

chrome.tabs.onActivated.addListener((arg) => {
    console.log("onActivated", arg.tabId);
    setIcon();
});

chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    console.log("onUpdated", tabId, tab.url, tab.pendingUrl);
    setIcon();
});
