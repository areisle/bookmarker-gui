/**
 * interface for using storage or local storage
 *
 * despite what the docs show, promises do not seem to work for global.browser.storage
 */

const get = async (key: string) => {
    if (typeof global.browser !== 'undefined' && global.browser.storage) {
        const result = await global.browser.storage.sync.get([key])
        return result[key]
    }
    return localStorage.getItem(key);
}

const set = async (key: string, value: string) => {
    if (typeof global.browser !== 'undefined' && global.browser.storage) {
        await global.browser.storage.sync.set({ [key]: value });
    }
    localStorage.setItem(key, value);
}

const remove = async (key: string) => {
    if (typeof global.browser !== 'undefined' && global.browser.storage) {
        await global.browser.storage.sync.remove([key])
    }
    localStorage.removeItem(key);

}

const storage = {
    get,
    set,
    remove,
}

export { storage };
