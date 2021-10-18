import { Link } from "@mui/material"
import React from "react"
import ReactDom from "react-dom"
import { PopupPage as Popup } from "./pages/PopupPage"
import { AuthProvider, QueryProvider } from "./queries"
import { PageMetaProvider } from "./queries/ActiveTabProvider"
import { CustomThemeProvider } from "./theme"

function PopupPage() {
    return (
        <span>
            <CustomThemeProvider>
                <QueryProvider>
                    <PageMetaProvider>
                        <AuthProvider isPopup={true}>
                            <Link onClick={() => chrome?.runtime.openOptionsPage()}>see all bookmarks</Link>
                            <Popup />
                        </AuthProvider>
                    </PageMetaProvider>
                </QueryProvider>
            </CustomThemeProvider>
        </span>
    )
}

ReactDom.render(<PopupPage />, document.getElementById('root'))
