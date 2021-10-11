import { storage } from "./storage";

const TOKEN_KEY = 'BOOKMARKER_EXT__TOKEN';

const USE_AUTH = process.env.NODE_ENV !== "development" || !process.env.NO_AUTH;

const getToken = async () => (await storage.get(TOKEN_KEY)) ?? '';
const setToken = (value: string) => storage.set(TOKEN_KEY, value);
const removeToken = () => storage.remove(TOKEN_KEY);

export { USE_AUTH, getToken, setToken, removeToken };
