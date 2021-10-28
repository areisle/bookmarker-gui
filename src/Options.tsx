import React from "react"
import ReactDom from "react-dom"
import { OptionsPage } from "./pages/OptionsPage"
import { AuthenticatedQueryProvider } from "./queries"
import { CustomThemeProvider } from "./theme"

function Options() {
    return (
        <span>
            <CustomThemeProvider>
                <AuthenticatedQueryProvider isPopup={false}>
                    <OptionsPage />
                </AuthenticatedQueryProvider>
            </CustomThemeProvider>
        </span>
    )
}

ReactDom.render(<Options />, document.getElementById('root'))
