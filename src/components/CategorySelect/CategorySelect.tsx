import { Box, CircularProgress, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useCategories } from '../../queries';


interface CategorySelectProps {
    value: number | null;
    onChange: (id: number) => void;
    bookmarkedCategories: number[] | undefined;
}

function CategorySelect(props: CategorySelectProps) {
    const { value, onChange, bookmarkedCategories } = props;

    const { data, isLoading, error } = useCategories(
        {},
        { select: (response) => response.categories, keepPreviousData: true }
    );

    return (
        <Box sx={{ marginTop: '5px' }}>
            <TextField
                select
                label="Category"
                value={value ?? 0}
                onChange={(e) => onChange(Number(e.target.value))}
                error={Boolean(error)}
                helperText={error ? error.message : ''}
                InputProps={{
                    endAdornment: isLoading ? <CircularProgress color="inherit" size={20} /> : null
                }}
                sx={{ minWidth: '200px' }}
            >

                <MenuItem value={0}>
                    None
                </MenuItem>
                {data?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                        {' '}
                        <span>{bookmarkedCategories?.includes(option.id) ? '★' : null}</span>
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
}

export { CategorySelect };
export type { CategorySelectProps };
