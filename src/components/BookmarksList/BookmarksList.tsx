import { Button, Link, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode, useMemo, useState } from 'react';
import { useAddTag, useBookmarks, useRemoveTag } from '../../queries';
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

/**
 * @todo format dates
 */
function BookmarksList(props: BookmarksListProps) {
    const { category, isActive } = props;
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [take, setTake] = useState(10);
    const [tagFilters, setTagFilters] = useFilterTags(category);

    const bookmarkWhere = useMemo(() => {
        return {
            AND: tagFilters.map(({ name, exclude }) => {
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
            })
        }
    }, [tagFilters]);

    const { data, isLoading: loading, error, refetch: refetchBookmarks, ...rest } = useBookmarks({
        categoryId: category,
        bookmarksSkip: 0,
        bookmarksTake: take,
        bookmarksWhere: bookmarkWhere,
        bookmarksOrderBy: [{ [orderBy]: order }]
    }, { keepPreviousData: true });

    const rows = data?.bookmarks

    const handleFetchMore = () => {
        setTake((prev) => prev + 20);
    }

    const { mutate: addTag } = useAddTag({
        onSuccess: () => refetchBookmarks()
    });
    const { mutate: removeTag } = useRemoveTag({
        onSuccess: () => refetchBookmarks()
    });

    const handleAddTag = (bookmarkId: number, tagName: string) => {
        addTag({ bookmarkId, name: tagName })
    }

    const handleDeleteTag = (bookmarkId: number, tagName: string) => {
        removeTag({ bookmarkId, name: tagName })
    }

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
            <TagsFilter
                categoryId={category}
                value={tagFilters}
                onChange={setTagFilters}
            />
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
                    {rows?.map((row) => (
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
                                    tags={row.tags}
                                    onAdd={(tagName) => handleAddTag(row.id, tagName)}
                                    onDelete={(tagName) => handleDeleteTag(row.id, tagName)}
                                    isEditable={isActive}
                                />
                            </TableCell>
                            {isActive && (
                                <TableCell padding='none'>
                                    <BookmarkEditorDialogButton
                                        bookmark={row}
                                        onSuccess={refetchBookmarks}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={handleFetchMore} sx={{ margin: 1 }} disabled={(rows?.length ?? 0) < take}>Load More</Button>
        </Box>
    );
}

export { BookmarksList };
export type { BookmarksListProps };
