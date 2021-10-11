import React from "react"
import ReactDom from "react-dom"
import { AuthProvider, QueryProvider } from "./queries"
import { CustomThemeProvider } from "./theme"

function OptionsPage() {
    return (
        <span>
            <CustomThemeProvider>
                <QueryProvider>
                    <AuthProvider>
                        options page
                    </AuthProvider>
                </QueryProvider>
            </CustomThemeProvider>
        </span>
    )
}

ReactDom.render(<OptionsPage />, document.getElementById('root'))
