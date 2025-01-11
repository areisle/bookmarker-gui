import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { createContext, ReactNode, useContext } from 'react';

interface EnhancedTableProps {
    order: 'asc' | 'desc';
    orderBy: string | null | undefined;
    onRequestSort: (field: string, order: 'asc' | 'desc') => void;
}

interface SortableHeaderCellProps {
    field: string;
    orderBy: string | null | undefined;
    order: 'asc' | 'desc';
    onRequestSort: (field: string, order: 'asc' | 'desc') => void;
}

function SortableHeaderCell(props: SortableHeaderCellProps) {
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



interface SortContextState {
    orderBy: string | null | undefined;
    order: 'asc' | 'desc';
    onRequestSort: (field: string, order: 'asc' | 'desc') => void;
}

const SortContext = createContext<SortContextState | undefined>(undefined)

interface HeaderProps extends SortContextState {
    children: ReactNode;
}
/**
 * show filters
 */
function Header(props: HeaderProps) {
    const { children, ...rest } = props;

    return (
        <TableHead>
            <SortContext.Provider value={rest}>
                <TableRow>
                    {children}
                </TableRow>
            </SortContext.Provider>
        </TableHead>
    );
}

interface HeaderCellProps {
    field?: string;
    children: string;
    sortable?: boolean;
}

function HeaderCell(props: HeaderCellProps) {
    const { children, field = children, sortable } = props;
    const context = useContext(SortContext);

    if (!context) {
        throw new Error('Missing Sort context');
    }

    const { order, orderBy, onRequestSort } = context;

    return (
        <TableCell
            key={field}
            sortDirection={orderBy === field ? order : false}
            sx={{ top: 48 }}
        >
            {sortable ? (
                <TableSortLabel
                    active={orderBy === field}
                    direction={orderBy === field ? order : 'asc'}
                    onClick={() => {
                        if (orderBy !== field || order === 'desc') {
                            onRequestSort?.(field, 'asc')
                        } else {
                            onRequestSort?.(field, 'desc')
                        }
                    }}
                >
                    {children}
                    {orderBy === field ? (
                        <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                    ) : null}
                </TableSortLabel>
            ) : children}
        </TableCell>
    )
}

export { Header, HeaderCell };
