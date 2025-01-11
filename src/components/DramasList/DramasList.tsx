import { Button, Chip, Link, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Add } from '@mui/icons-material';
import { useInfiniteDramas, useUpdateDrama } from '../../queries';
import { DramaEditorDialogButton } from '../DramaEditor';
import { RelativeDate } from '../RelativeDate';
import { DramasFilter, useStoredFilterText, textToFilter } from './Filter';
import { Header, HeaderCell } from './Header';
import DramaniceLogoUrl from './dramanice-favicon.png';
import DramalistLogoUrl from './mydramalist-icon.png';

function DramasList() {
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState('lastModifiedAt');
    const [filterText, setFilterText] = useStoredFilterText();

    const handleRequestSort = useCallback((field: string, nextOrder: 'asc' | 'desc') => {
        setOrder(nextOrder);
        setOrderBy(field)
    }, []);

    const where = useMemo(() => {
        return textToFilter(filterText);
    }, [filterText]);

    const {
        data,
        isLoading: loading,
        error,
        hasNextPage,
        refetch: refetchDramas,
        fetchNextPage,
    } = useInfiniteDramas({
        where,
        orderBy: [{ [orderBy]: order }],
        take: 50,
    });

    const { mutate: updateDrama } = useUpdateDrama({
        onSuccess: () => refetchDramas(),
    })

    const handleFetchMore = () => {
        fetchNextPage();
    }

    const { rows, count, total } = useMemo(() => {
        let nextCount = 0;
        let nextRows: ReactNode[] = [];

        data?.pages.forEach((group, i) => {
            nextCount += (group.meta.count ?? 0);
            group.data.forEach((row) => {
                // split out dramalist and dramanice links
                let dramaniceLink: ReactNode = null;
                let dramalistLink: ReactNode = null;
                const links: typeof row.links = [];
                for (const link of row.links) {
                    if (!dramaniceLink && link.url.includes('dramanice.')) {
                        dramaniceLink = (
                            <Link
                                href={link.url}
                                title={link.url}
                            >
                                <Box
                                    component='img'
                                    src='icons/dramanice-icon.png'
                                    sx={{ width: 25, height: 25 }}
                                ></Box>
                            </Link>
                        )
                    } else if (!dramalistLink && link.url.includes('mydramalist.com')) {
                        dramalistLink = (
                            <Link
                                href={link.url}
                                title={link.url}
                            >
                                <Box
                                    component='img'
                                    src='icons/dramalist-icon.png'
                                    sx={{ width: 25, height: 25 }}
                                ></Box>
                            </Link>
                        )
                    } else {
                        links.push(link)
                    }
                }
                const rowSpan = links.length + 1;

                const tags: ReactNode[] = [];

                const userTags: string[] = [];

                row.groupedTags.forEach(({ count, name, current }) => {
                    const label = count > 1 ? `${name} (${count})` : name;

                    if (current) {
                        userTags.push(name);
                        tags.push(
                            <Chip
                                key={name}
                                variant='filled'
                                label={label}
                            />
                        )
                    } else {
                        tags.push(
                            <Chip
                                key={name}
                                variant='outlined'
                                label={label}

                            />
                        )
                    }
                })

                nextRows.push(
                    <TableRow
                        key={`${row.id}_0`}
                        hover
                        tabIndex={-1}
                    >
                        <TableCell rowSpan={rowSpan}>{row.title}</TableCell>
                        <TableCell>
                            <Box sx={{ display: 'flex', gap: '5px' }}>
                                {dramaniceLink}
                                {dramalistLink}
                            </Box>
                        </TableCell>
                        <TableCell rowSpan={rowSpan}>
                            <RelativeDate>{row.createdAt}</RelativeDate>
                        </TableCell>
                        <TableCell rowSpan={rowSpan}>
                            <RelativeDate>{row.lastModifiedAt}</RelativeDate>
                        </TableCell>
                        <TableCell rowSpan={rowSpan}>{row.status}</TableCell>
                        <TableCell rowSpan={rowSpan}>{row.currentUserWatched}</TableCell>
                        <TableCell rowSpan={rowSpan}>{row.description}</TableCell>
                        <TableCell rowSpan={rowSpan}>
                            <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                {tags}
                            </Box>
                        </TableCell>
                        <TableCell rowSpan={rowSpan}>{row.country}</TableCell>
                        <TableCell rowSpan={rowSpan}>{row.episodeCount}</TableCell>
                        <TableCell rowSpan={rowSpan}>{row.episodeDuration}</TableCell>
                        <TableCell rowSpan={rowSpan}>{row.finishedAiringAt?.split('T')[0] ?? null}</TableCell>
                        <TableCell rowSpan={rowSpan} padding='none'>
                            <DramaEditorDialogButton
                                drama={row}
                                onSuccess={() => refetchDramas()}
                            />
                        </TableCell>
                    </TableRow>
                );
                links.forEach((link, i) => {
                    nextRows.push(
                        <TableRow
                            key={`${row.id}_${i + 1}`}
                            hover
                            tabIndex={-1}
                        >
                            <TableCell>
                                <Link href={link.url} title={link.url}>{link.title}</Link>
                            </TableCell>
                        </TableRow>
                    )
                })
            })
        })

        return {
            rows: nextRows,
            count: nextCount,
            total: data?.pages[0].meta.total
        }
    }, [data, refetchDramas]);

    let helperText: ReactNode;

    if (loading) {
        helperText = <Typography>loading dramas...</Typography>
    } else if (error) {
        helperText = <Typography color='error'>Unable to load dramas. {error.message}</Typography>
    } else if (!rows?.length) {
        helperText = <Typography>No dramas to show.</Typography>
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <DramasFilter
                value={filterText}
                onChange={setFilterText}
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
                    onRequestSort={handleRequestSort}
                >
                    <HeaderCell sortable={true}>
                        title
                    </HeaderCell>
                    <HeaderCell>
                        url
                    </HeaderCell>
                    <HeaderCell sortable={true}>
                        createdAt
                    </HeaderCell>
                    <HeaderCell sortable={true}>
                        lastModifiedAt
                    </HeaderCell>
                    <HeaderCell>
                        status
                    </HeaderCell>
                    <HeaderCell>
                        watched
                    </HeaderCell>
                    <HeaderCell>
                        description
                    </HeaderCell>
                    <HeaderCell>
                        tags
                    </HeaderCell>
                    <HeaderCell>country</HeaderCell>
                    <HeaderCell>episode count</HeaderCell>
                    <HeaderCell>episode duration</HeaderCell>
                    <HeaderCell>aired</HeaderCell>
                    <HeaderCell>
                        edit
                    </HeaderCell>
                </Header>
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
        </Box >
    );
}

export { DramasList };
