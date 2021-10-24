import React from "react"
import ReactDom from "react-dom"
import { PopupPage as Popup } from "./pages/PopupPage"
import { AuthenticatedQueryProvider } from "./queries"
import { PageMetaProvider } from "./queries/ActiveTabProvider"
import { CustomThemeProvider } from "./theme"

function PopupPage() {
    return (
        <span>
            <CustomThemeProvider>
                <AuthenticatedQueryProvider isPopup={true}>
                    <PageMetaProvider>
                        <Popup />
                    </PageMetaProvider>
                </AuthenticatedQueryProvider>
            </CustomThemeProvider>
        </span>
    )
}

ReactDom.render(<PopupPage />, document.getElementById('root'))
