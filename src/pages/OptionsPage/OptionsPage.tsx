import React, { ReactNode, useState } from 'react';
import { Button, ListItem, ListItemText, MenuItem, MenuList, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CategorySettings } from '../../components/CategorySettings';
import { useAuth, useGetCategory, useJoinCategory } from '../../queries';
import { AddCategory } from './AddCategory';
import { TabPanel, tabProps } from '../../components/TabPanel';
import { BookmarksList } from '../../components/BookmarksList';
import { useSelectedCategory } from '../../queries/useSelectedCategory';

function OptionsPage() {
    const {
        categories,
        categoryId: id,
        setCategoryId: setId,
        isLoading: loading,
        error,
    } = useSelectedCategory();

    const [tab, setTab] = useState(0);
    const { logout } = useAuth();

    const { data: category, isLoading: isLoadingCategory, refetch } = useGetCategory(
        { id: id! },
        {
            select: (response) => response.category,
            enabled: Boolean(id)
        }
    )

    const { mutate: joinCategory, error: errorJoining, isLoading: isJoining } = useJoinCategory(
        { onSuccess: () => refetch() }
    );


    let content: ReactNode;

    if (loading) {
        content = <Typography>loading categories...</Typography>
    } else if (error) {
        content = <Typography color='error'>Unable to retrieve bookmark categories. {error.message}</Typography>
    } else if (id) {
        content = (
            <>
                <TabPanel value={tab} index={0}>
                    <BookmarksList category={id} isActive={Boolean(category?.isActive)} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <CategorySettings id={id} category={category} isLoading={isLoadingCategory} />
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
                    {categories?.map((category) => (
                        <MenuItem
                            key={category.id}
                            onClick={() => setId(category.id)}
                            selected={category.id === id}
                        >
                            <ListItemText primary={`${category.name} (${category.bookmarksCount})`} />
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
                    <Box
                        sx={{ alignSelf: 'center', marginInlineStart: 'auto', gap: 1, display: 'flex' }}
                        pr={1}
                    >
                        {!category?.isActive && (
                            <Button
                                onClick={() => joinCategory({ id: id! })}
                            >
                                join category
                            </Button>
                        )}
                        <Button
                            onClick={logout}
                            variant='text'
                        >
                            logout
                        </Button>
                    </Box>
                </Tabs>
                {content}
            </Box>
        </Box>
    );
}

export { OptionsPage };
