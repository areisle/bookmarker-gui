import React from "react"
import ReactDom from "react-dom"
import { PopupPage as Popup } from "./pages/PopupPage"
import { AuthProvider, QueryProvider } from "./queries"
import { CustomThemeProvider } from "./theme"

function PopupPage() {
    return (
        <span>
            <CustomThemeProvider>
                <QueryProvider>
                    <AuthProvider isPopup={true}>
                        <Popup />
                    </AuthProvider>
                </QueryProvider>
            </CustomThemeProvider>
        </span>
    )
}

ReactDom.render(<PopupPage />, document.getElementById('root'))
