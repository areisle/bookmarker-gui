async function getCurrentUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.id, tab.url);
    return tab.url;
}

export { getCurrentUrl };
