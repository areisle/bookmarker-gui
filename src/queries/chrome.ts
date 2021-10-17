async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function getCurrentUrl() {
    const tab = await getCurrentTab();
    return tab.url;
}

export { getCurrentUrl, getCurrentTab };
