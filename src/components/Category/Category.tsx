import { Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { BookmarksList } from '../BookmarksList';
import { CategorySettings } from './CategorySettings';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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
                <Tab label="Bookmarks" {...a11yProps(0)} sx={{ bgcolor: 'background.paper' }} />
                <Tab label="Settings" {...a11yProps(1)} sx={{ bgcolor: 'background.paper' }} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <BookmarksList category={id} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Typography variant='h3'>Users</Typography>
                <CategorySettings id={id} />
            </TabPanel>
        </>
    );
}

export { Category };
export type { CategoryProps };
