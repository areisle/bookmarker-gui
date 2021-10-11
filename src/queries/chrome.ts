async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.id, tab.url);
    return tab;
}

async function getCurrentUrl() {
    const tab = await getCurrentTab();
    return tab.url;
}

export { getCurrentUrl, getCurrentTab };
