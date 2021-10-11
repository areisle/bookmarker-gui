/**
 * interface for using storage or local storage
 *
 * despite what the docs show, promises do not seem to work for chrome.storage
 */

const get = async (key: string) => {
    if (typeof chrome !== 'undefined') {
        return new Promise<string>((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key]);
            });
        });
    }
    return localStorage.getItem(key);
}

const set = async (key: string, value: string) => {
    if (typeof chrome !== 'undefined') {
        console.log('storage set', key, value)
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, () => {
                resolve(null);
            });
        });
    }
    localStorage.setItem(key, value);
}

const remove = async (key: string) => {
    if (typeof chrome !== 'undefined') {
        console.log('storage remove', key)
        return new Promise((resolve) => {
            chrome.storage.local.remove([key], () => {
                resolve(null);
            });
        });
    }
    localStorage.removeItem(key);

}

const storage = {
    get,
    set,
    remove,
}

export { storage };
