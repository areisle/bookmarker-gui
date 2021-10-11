import { Button } from "@mui/material"
import React, { useEffect } from "react"
import ReactDom from "react-dom"
import { LoginPage } from "./pages/LoginPage"

function PopupPage() {
    const handleClick = () => {
        chrome?.runtime.openOptionsPage()
    }

    return (
        <span>
            <Button onClick={handleClick}>Login</Button>
        </span>
    )
}

ReactDom.render(<PopupPage />, document.getElementById('root'))
