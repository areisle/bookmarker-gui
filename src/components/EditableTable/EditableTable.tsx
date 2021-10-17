import { Edit } from '@mui/icons-material';
import { Table, TableHead, TableRow, TableBody, TableCell, Skeleton, IconButton } from '@mui/material';
import React, { ReactNode, useState } from 'react';


interface Row {
    id: string | number;
    [key: string]: unknown;
}

interface ColumnDef<R extends Row> {
    field: string;
    label?: string;
    Renderer?: (rendererProps: { field: string; row: R }) => JSX.Element;
}

interface EditableTableProps<R extends Row = Row> {
    columns: ColumnDef<R>[]
    rows: R[] | undefined;
    isEditable?: boolean;
    editor?: (props: { open: boolean; onClose: () => void; row: R | null }) => ReactNode;
    isLoading?: boolean;
}

function EditableTable<R extends Row>(props: EditableTableProps<R>) {
    const { columns, rows, isEditable, isLoading, editor } = props;

    const [rowForEditing, setRowForEditing] = useState<R | null>(null);

    return (
        <>
            {editor?.({
                open: Boolean(rowForEditing),
                row: rowForEditing,
                onClose: () => setRowForEditing(null)
            })}
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field}>
                                {column.label ?? column.field}
                            </TableCell>
                        ))}
                        {isEditable && (
                            <TableCell>edit</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rows ?? (isLoading ? [{ id: 0 } as R] : [])).map((row) => (
                        <TableRow key={row.id}>
                            {columns.map(({ field, Renderer }) => {
                                if (isLoading) {
                                    return <TableCell><Skeleton /></TableCell>
                                }
                                if (Renderer) {
                                    return <TableCell><Renderer field={field} row={row} /></TableCell>
                                }
                                return <TableCell>{String(row[field])}</TableCell>
                            })}
                            {isEditable && (
                                <TableCell padding='none'>
                                    <IconButton onClick={() => setRowForEditing(row)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    {(!rows?.length && !isLoading) && (
                        <TableRow>
                            <TableCell colSpan={columns.length + (isEditable ? 1 : 0)}>
                                No rows to show.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export { EditableTable };
export type { EditableTableProps };
