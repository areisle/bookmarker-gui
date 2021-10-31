import { Button, Link, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode, useLayoutEffect, useMemo, useState } from 'react';
import { Bookmark, useAddTag, useInfiniteBookmarks, useRemoveTag } from '../../queries';
import { BookmarkEditorDialogButton } from '../BookmarkEditor';
import { RelativeDate } from '../RelativeDate';
import { TagsFilter } from '../TagsFilter';
import { Header } from './Header';
import { Tags } from './Tags';
import { useFilterTags } from './useFIlterTags';

interface BookmarksListProps {
    category: number;
    isActive: boolean;
}

interface RowProps {
    row: Bookmark;
    isEditable: boolean;
    onFinishedEditing: () => void;
    onAddTag: (id: number, name: string) => void;
    onDeleteTag: (id: number, name: string) => void;
}

function Row(props: RowProps) {
    const { row, isEditable, onAddTag, onDeleteTag, onFinishedEditing } = props;
    return (
        <TableRow
            key={row.id}
            hover
            tabIndex={-1}
        >
            <TableCell>
                <Link href={row.url} title={row.url}>{row.title}</Link>
            </TableCell>
            <TableCell>
                {row.aliases.length || null}
            </TableCell>
            <TableCell><RelativeDate>{row.createdAt}</RelativeDate></TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>
                <Tags
                    tags={row.groupedTags}
                    onAdd={(tagName) => onAddTag(row.id, tagName)}
                    onDelete={(tagName) => onDeleteTag(row.id, tagName)}
                    isEditable={isEditable}
                />
            </TableCell>
            {isEditable && (
                <TableCell padding='none'>
                    <BookmarkEditorDialogButton
                        bookmark={row}
                        onSuccess={onFinishedEditing}
                    />
                </TableCell>
            )}
        </TableRow>
    )
}

/**
 * @todo format dates
 */
function BookmarksList(props: BookmarksListProps) {
    const { category, isActive } = props;
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [tagFilters, setTagFilters] = useFilterTags(category);
    const [search, setSearch] = useState('');

    useLayoutEffect(() => {
        setSearch('');
    }, [category]);

    const bookmarkWhere = useMemo(() => {
        const filters: Record<string, unknown>[] = tagFilters.map(({ name, exclude }) => {
            if (exclude) {
                return {
                    tags: {
                        every: {
                            name: {
                                not: name
                            }
                        }
                    }
                }
            }

            return {
                tags: {
                    some: {
                        name
                    }
                }
            }
        });

        if (search) {
            filters.push({
                OR: [
                    { title: { contains: search } },
                    { url: { contains: search } },
                    {
                        aliases: {
                            some: {
                                url: {
                                    contains: search
                                }
                            }
                        }
                    }
                ]
            })
        }

        return {
            AND: filters
        }
    }, [tagFilters, search]);

    const {
        data,
        isLoading: loading,
        error,
        hasNextPage,
        refetch: refetchBookmarks,
        fetchNextPage,
    } = useInfiniteBookmarks({
        categoryId: category,
        where: bookmarkWhere,
        orderBy: [{ [orderBy]: order }],
        take: 20,
    });

    const handleFetchMore = () => {
        fetchNextPage();
    }

    const { mutate: addTag } = useAddTag({
        onSuccess: () => refetchBookmarks()
    });
    const { mutate: removeTag } = useRemoveTag({
        onSuccess: () => refetchBookmarks()
    });

    const { rows, count, total } = useMemo(() => {
        let nextCount = 0;
        let nextRows: ReactNode[] = [];

        data?.pages.forEach((group, i) => {
            nextCount += (group.meta.count ?? 0);
            group.data.forEach((row) => {
                nextRows.push(
                    <Row
                        key={row.id}
                        row={row}
                        onAddTag={(bookmarkId, name) => addTag({ bookmarkId, name })}
                        onDeleteTag={(bookmarkId, name) => removeTag({ bookmarkId, name })}
                        onFinishedEditing={refetchBookmarks}
                        isEditable={isActive}
                    />
                );
            })
        })

        return {
            rows: nextRows,
            count: nextCount,
            total: data?.pages[0].meta.total
        }
    }, [data, isActive, addTag, removeTag, refetchBookmarks]);

    let helperText: ReactNode;

    if (loading) {
        helperText = <Typography>loading bookmarks...</Typography>
    } else if (error) {
        helperText = <Typography color='error'>Unable to load bookmarks. {error.message}</Typography>
    } else if (!rows?.length) {
        helperText = <Typography>No bookmarks to show.</Typography>
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                label='search by title or url'
                fullWidth={true}
            />
            <TagsFilter
                categoryId={category}
                value={tagFilters}
                onChange={setTagFilters}
            />
            <Typography
                variant='caption'
                align='right'
                component='p'
                sx={{ p: 0.5 }}
            >
                showing {count ?? '?'} of {total ?? '?'}
            </Typography>
            <Table stickyHeader>
                <Header
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={(field, nextOrder) => {
                        setOrder(nextOrder);
                        setOrderBy(field)
                    }}
                    isActive={isActive}
                />
                <TableBody>
                    {helperText && (
                        <TableRow>
                            <TableCell colSpan={4}>{helperText}</TableCell>
                        </TableRow>
                    )}
                    {rows}
                </TableBody>
            </Table>
            <Button onClick={handleFetchMore} sx={{ margin: 1 }} disabled={!hasNextPage}>Load More</Button>
        </Box>
    );
}

export { BookmarksList };
export type { BookmarksListProps };
