import { Typography, Stack, Table, TableBody, TableCell, TableRow, Alert } from '@mui/material';
import React from 'react';
import { useQueryClient } from 'react-query';
import { GetCategory } from '../../queries';
import { EditableTable } from '../EditableTable';


interface PatternAliasesProps {
    categoryId: number;
    rules: NonNullable<GetCategory['category']>['rules'] | undefined;
    isLoading: boolean;
    isAdmin?: boolean;
}

function PatternAliases(props: PatternAliasesProps) {
    const { categoryId, rules, isLoading, isAdmin } = props;

    const queryClient = useQueryClient();

    return (
        <Stack spacing={1}>
            <Typography variant='h3'>Rules for default url aliases</Typography>
            <Alert severity='info' sx={{ fontSize: 'small', '& MuiTypography-root, & .MuiTableCell-root': { fontSize: 'inherit' }, maxWidth: 800 }}>
                <Typography>
                    These are similar to bookmark aliases but decide a pattern vs. being set for a particular existing bookmark.
                    They're are useful for when you want many links to point to the same bookmark and the links all follow a discernable pattern.
                </Typography>
                <Typography>
                    For example, suppose you want to bookmark a show and access that bookmark from any episode, but the episode are all each their own page.
                    If the main url for show was www.movies.com/shows/my-show-name and the link for the first episode was www.movies.com/shows/my-show-name/episode-1 (and similar for episode 2 etc.),
                    then the following could be used to associate the links automatically for any show on that site:
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell variant='head'>origin</TableCell>
                            <TableCell>www.movies.com</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant='head'>match</TableCell>
                            <TableCell>\/shows\/(?&lt;name&gt;.+)\/episode-\d+</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant='head'>canonical</TableCell>
                            <TableCell>/shows/$&lbrace;name&rbrace;</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Alert>
            <EditableTable
                rows={rules}
                columns={[
                    { field: 'origin', isEditable: true },
                    { field: 'match', isEditable: true },
                    { field: 'canonical', isEditable: true },
                ]}
                isLoading={isLoading}
                isDeletable={isAdmin}
                isCreatable={isAdmin}
                isEditable={isAdmin}
                addButtonLabel='Add new pattern'
            />
        </Stack>
    );
}

export { PatternAliases };
export type { PatternAliasesProps };
