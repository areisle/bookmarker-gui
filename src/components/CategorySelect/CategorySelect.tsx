import { Box, CircularProgress, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useCategories } from '../../queries';


interface CategorySelectProps {
    value: number | null;
    onChange: (id: number) => void;
}

function CategorySelect(props: CategorySelectProps) {
    const { value, onChange } = props;

    const { data, isLoading, error } = useCategories(
        {},
        { select: (response) => response.categories, keepPreviousData: true }
    );

    return (
        <Box sx={{ marginTop: '5px' }}>
            <TextField
                select
                label="Category"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                error={Boolean(error)}
                helperText={error ? error.message : ''}
                InputProps={{
                    endAdornment: isLoading ? <CircularProgress color="inherit" size={20} /> : null
                }}
                sx={{ minWidth: '200px' }}
            >
                {data?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                )) ?? (
                        <MenuItem value={0}>
                            No Categories
                        </MenuItem>
                    )}
            </TextField>
        </Box>
    );
}

export { CategorySelect };
export type { CategorySelectProps };
