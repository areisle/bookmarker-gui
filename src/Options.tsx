import React from "react"
import ReactDom from "react-dom"
import { LoginPage } from "./pages/LoginPage"

function OptionsPage() {
    return (<span><LoginPage /></span>)
}

ReactDom.render(<OptionsPage />, document.getElementById('root'))
