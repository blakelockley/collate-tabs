async function getAllTabs() {
    return await chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
}

function orderTabsByDomain(tabs) {
    let orderedTabs = [];

    for (const tab of tabs) {
        const host = new URL(tab.url).host;
        
        let index = orderedTabs.findIndex(exsitingTab => {
            return (new URL(exsitingTab.url).host === host)
        })

        if (index < 0)
            orderedTabs.push(tab);
        else {
            try {
                while (new URL(orderedTabs[index]?.url).host === host)
                    index++;
            } catch {}

            orderedTabs.splice(index, 0, tab);
        }
    }

    return orderedTabs;
}

async function moveTabsToIndex(tabs) {
    for (const [index, tab] of tabs.entries())
        await chrome.tabs.move(tab.id, { index });
}

(async () => {
    const tabs = await getAllTabs();
    const orderedTabs = orderTabsByDomain(tabs);
    
    await moveTabsToIndex(orderedTabs);
})();
