import React from "react"
import ReactDom from "react-dom"
import { OptionsPage } from "./pages/OptionsPage"
import { AuthProvider, QueryProvider } from "./queries"
import { CustomThemeProvider } from "./theme"

function Options() {
    return (
        <span>
            <CustomThemeProvider>
                <QueryProvider>
                    <AuthProvider>
                        <OptionsPage />
                    </AuthProvider>
                </QueryProvider>
            </CustomThemeProvider>
        </span>
    )
}

ReactDom.render(<Options />, document.getElementById('root'))
