import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { BookmarksList } from '../BookmarksList';
import { TabPanel, tabProps } from '../TabPanel';
import { CategorySettings } from './CategorySettings';

interface CategoryProps {
    id: number;
}

function Category(props: CategoryProps) {
    const { id } = props;
    const [tab, setTab] = useState(0);
    return (
        <>
            <Tabs
                value={tab}
                onChange={(_, nextTab) => setTab(nextTab)}
                aria-label="category sub-page"
                sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper', pl: 1 }}
            >
                <Tab label="Bookmarks" {...tabProps(0)} sx={{ bgcolor: 'background.paper' }} />
                <Tab label="Settings" {...tabProps(1)} sx={{ bgcolor: 'background.paper' }} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <BookmarksList category={id} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <CategorySettings id={id} />
            </TabPanel>
        </>
    );
}

export { Category };
export type { CategoryProps };
