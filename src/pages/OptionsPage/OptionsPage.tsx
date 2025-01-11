import React, { useState } from 'react';
import { Button, Box, Tab as MuiTab, Tabs } from '@mui/material';
import { useAuth, useCurrentUser } from '../../queries';
import { DramasList, Users } from '../../components';
import { ActivityList } from '../../components/ActivityList';

function Tab(props: { value: string | number, label?: string | number }) {
    const { value, label = String(value), ...rest } = props;

    return (
        <MuiTab
            {...rest}
            id={`simple-tab-${value}`}
            aria-controls={`simple-tabpanel-${value}`}
            label={label}
            value={value}
            sx={{ bgcolor: 'background.paper' }}
        />
    )
}

interface TabPanelProps {
    children?: React.ReactNode;
    value: number | string;
    tab: number | string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, tab } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== tab}
            id={`simple-tabpanel-${tab}`}
            aria-labelledby={`simple-tab-${tab}`}
        >
            {value === tab && (
                <Box sx={{ p: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function OptionsPage() {

    const { logout } = useAuth();
    const user = useCurrentUser();
    const [tab, setTab] = useState('Dramas');

    return (
        <Box>
            <Box sx={{ flexGrow: 1 }} component='main'>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper', gap: '5px' }}>
                    <Tabs
                        value={tab}
                        onChange={(_, nextTab) => {
                            setTab(nextTab);
                        }}
                        sx={{ pl: 1, flexGrow: 1 }}
                    >
                        <Tab value="Dramas" />
                        {user.admin && (<Tab value="Settings" />)}
                        <Tab value="Activity" />
                    </Tabs>
                    <Box
                        sx={{ alignSelf: 'center', marginInlineStart: 'auto', gap: 1, display: 'flex' }}
                        pr={1}
                    >
                        <Button
                            onClick={logout}
                            variant='text'
                        >
                            logout
                        </Button>
                    </Box>
                </Box>
                <TabPanel value={tab} tab="Dramas">
                    <DramasList />
                </TabPanel>
                <TabPanel value={tab} tab="Activity">
                    <ActivityList />
                </TabPanel>
                <TabPanel value={tab} tab="Settings">
                    <Users />
                </TabPanel>
            </Box>
        </Box>
    );
}

export { OptionsPage };
