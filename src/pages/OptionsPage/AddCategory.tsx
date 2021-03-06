import { CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useAddCategory } from '../../queries';

const stop = (e: React.KeyboardEvent<HTMLDivElement>) => e.stopPropagation();

function AddCategory() {
    const [inputValue, setInputValue] = useState('');
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useAddCategory({
        onSuccess: () => {
            setInputValue('')
            queryClient.invalidateQueries('categories')
        }
    });

    const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter') {
            // create new category
            mutate({
                name: inputValue,
            })
        }
    }

    return (
        <div>
            <TextField
                aria-label='Add Category'
                placeholder='Add Category'
                disabled={isLoading}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                }}
                // see https://github.com/mui-org/material-ui/issues/19096
                onKeyDown={stop}
                onKeyUp={handleEnter}
                InputProps={{
                    endAdornment: (
                        <React.Fragment>
                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        </React.Fragment>
                    ),
                }}
            />
        </div>
    )
}

export { AddCategory }
