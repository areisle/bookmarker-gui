import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';

interface EnhancedTableProps {
    order: 'asc' | 'desc';
    orderBy: string | null | undefined;
    onRequestSort: (field: string, order: 'asc' | 'desc') => void;
}

interface HeaderCellProps {
    field: string;
    orderBy: string | null | undefined;
    order: 'asc' | 'desc';
    onRequestSort: (field: string, order: 'asc' | 'desc') => void;
}

function SortableHeaderCell(props: HeaderCellProps) {
    const { field, orderBy, order, onRequestSort } = props;
    return (
        <TableCell
            key={field}
            sortDirection={orderBy === field ? order : false}
            sx={{ top: 48 }}
        >
            <TableSortLabel
                active={orderBy === field}
                direction={orderBy === field ? order : 'asc'}
                onClick={() => {
                    if (orderBy !== field || order === 'desc') {
                        onRequestSort(field, 'asc')
                    } else {
                        onRequestSort(field, 'desc')
                    }
                }}
            >
                {field}
                {orderBy === field ? (
                    <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
            </TableSortLabel>
        </TableCell>
    )
}

/**
 * show filters
 */
function Header(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;

    return (
        <TableHead>
            <TableRow>
                <SortableHeaderCell
                    field='title'
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={onRequestSort}
                />
                <SortableHeaderCell
                    field='createdAt'
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={onRequestSort}
                />
                <TableCell sx={{ top: 48 }}>
                    description
                </TableCell>
                <TableCell sx={{ top: 48 }}>
                    tags
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

export { Header };
