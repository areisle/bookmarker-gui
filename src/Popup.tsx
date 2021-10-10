import React, { useEffect } from "react"
import ReactDom from "react-dom"

function PopupPage() {
    useEffect(() => {
    }, []);

    const handleClick = () => {
        chrome.identity.getAuthToken({ interactive: true }, async function (token) {
            console.log({ token });
        });
    }

    return (<span><button onClick={handleClick}>run auth check</button></span>)
}

ReactDom.render(<PopupPage />, document.getElementById('root'))
