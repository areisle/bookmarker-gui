import React from "react"
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<PopupPage />);
