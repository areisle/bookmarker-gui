const setIcon = async () => {
    const [tab] = await global.browser!.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    const { email } = await global.browser!.storage.local.get(["email"]);

    console.log('email?', email);

    if (tab.url) {
        const iconUrl = await getIconUrl(email, tab.url);
        await global.browser!.browserAction.setIcon({
            path: iconUrl,
            tabId: tab.id,
        });
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
                query isDramaBookmarked($url: String!) {
                    isDramaBookmarked(url: $url)
                }`,
                variables: { url },
            }),
        });

        const result = await response.json();

        if (result.errors?.[0]?.extensions?.code === "UNAUTHENTICATED") {
            return "icons/icon-warning-64.png";
        }

        if (result.data.isDramaBookmarked) {
            return "icons/icon-bookmarked-64.png";
        }

        return "icons/icon-unbookmarked-64.png";
    } catch (e) {
        console?.log("error getting is bookmarked", e);
    }

    return "icons/icon-warning-64.png";
};


global.browser!.tabs.onActivated.addListener((arg) => {
    setIcon();
});

global.browser!.tabs.onUpdated.addListener(async (tabId, _, tab) => {
    setIcon();
});
