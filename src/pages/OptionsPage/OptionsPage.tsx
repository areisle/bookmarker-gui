import React, { ReactNode, useState, useLayoutEffect } from 'react';
import { Button, ListItem, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Category } from '../../components/Category';
import { useCategories } from '../../queries';
import { AddCategory } from './AddCategory';

interface Category {
    id: number;
    name: string;
}

function OptionsPage() {
    const { data, error, isLoading: loading } = useCategories({});

    const [id, setId] = useState<number | null>(null);

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
        content = <Category id={id!} />
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
                {content}
            </Box>
        </Box>
    );
}

export { OptionsPage };
