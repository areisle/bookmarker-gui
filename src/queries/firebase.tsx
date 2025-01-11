import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

let app: ReturnType<typeof initializeApp> | undefined;
let provider: GoogleAuthProvider | undefined;
let auth: ReturnType<typeof getAuth> | undefined;

if (process.env.NODE_ENV !== 'test') {
    app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG!));
    provider = new GoogleAuthProvider();
    auth = getAuth();
}

const requestLogin = async () => {
    if (!auth || !provider) {
        throw new Error('firebase not initialized');
    }
    const { user } = await signInWithPopup(auth, provider);
    return user;
};

const requestLogout = async () => {
    if (!auth) {
        throw new Error('firebase not initialized');
    }
    return signOut(auth);
};

const useToken = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        if (!auth || !provider) {
            throw new Error('firebase not initialized');
        }
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await (auth as ReturnType<typeof getAuth>).currentUser?.getIdToken();
                setToken(token ?? '')
            } else {
                setToken('')
            }
        });

    }, []);

    return token
}

export { requestLogin, useToken, requestLogout };
