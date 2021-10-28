import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG!));

const provider = new GoogleAuthProvider();
const auth = getAuth();

const requestLogin = async () => {
    const { user } = await signInWithPopup(auth, provider);
    return user;
};

const requestLogout = async () => signOut(auth);

const useToken = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await auth.currentUser?.getIdToken();
                setToken(token ?? '')
            } else {
                setToken('')
            }
        });

    }, []);

    return token
}

export { requestLogin, useToken, requestLogout };
