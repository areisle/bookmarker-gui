import React, { ReactNode, useState, useLayoutEffect } from 'react';
import { ListItem, ListItemText, MenuItem, MenuList, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CategorySettings } from '../../components/CategorySettings';
import { useCategories } from '../../queries';
import { AddCategory } from './AddCategory';
import { TabPanel, tabProps } from '../../components/TabPanel';
import { BookmarksList } from '../../components/BookmarksList';

function OptionsPage() {
    const { data, error, isLoading: loading } = useCategories({});

    const [id, setId] = useState<number | null>(null);
    const [tab, setTab] = useState(0);

    useLayoutEffect(() => {
        if (!id && data?.categories.length) {
            setId(data.categories[0].id)
        } else if (id) {
            const exists = data?.categories.some((category) => category.id === id);
            if (!exists) {
                setId(null)
            }
        }
    }, [data, id]);

    let content: ReactNode;

    if (loading) {
        content = <Typography>loading categories...</Typography>
    } else if (error) {
        content = <Typography color='error'>Unable to retrieve bookmark categories. {error.message}</Typography>
    } else if (id) {
        content = (
            <>
                <TabPanel value={tab} index={0}>
                    <BookmarksList category={id} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <CategorySettings id={id} />
                </TabPanel>
            </>
        )
    } else {
        content = <Typography>No category selected.</Typography>
    }


    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'min-content 1fr' }}>
            {/* show categories */}
            <Box component='header'>
                <MenuList
                    dense
                    sx={{ position: 'sticky', top: 0, padding: 1, minWidth: 160 }}
                    disablePadding={true}
                >
                    {data?.categories.map((category) => (
                        <MenuItem
                            key={category.id}
                            onClick={() => setId(category.id)}
                            selected={category.id === id}
                        >
                            <ListItemText primary={category.name} />
                        </MenuItem>
                    ))}
                    <ListItem>
                        <AddCategory />
                    </ListItem>
                </MenuList>
            </Box>
            <Box sx={{ flexGrow: 1 }} component='main'>
                <Tabs
                    value={tab}
                    onChange={(_, nextTab) => setTab(nextTab)}
                    aria-label="category sub-page"
                    sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper', pl: 1 }}
                >
                    <Tab label="Bookmarks" {...tabProps(0)} sx={{ bgcolor: 'background.paper' }} />
                    <Tab label="Settings" {...tabProps(1)} sx={{ bgcolor: 'background.paper' }} />
                </Tabs>
                {content}
            </Box>
        </Box>
    );
}

export { OptionsPage };
