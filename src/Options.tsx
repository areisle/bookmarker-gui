import React from "react"
import { createRoot } from 'react-dom/client';
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


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Options />)
