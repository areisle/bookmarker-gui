import { Delete, Edit } from '@mui/icons-material';
import { Table, TableHead, TableRow, TableBody, TableCell, Skeleton, IconButton, TextField, Button, Checkbox, Box, Stack } from '@mui/material';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { ConfirmButton } from '../ConfirmButton';


interface Row {
    id?: string | number | undefined;
    [key: string]: unknown;
}

interface FieldEditorProps<R extends Row> {
    field: string;
    row: Partial<R>;
    value: unknown;
    onChange: (nextValue: unknown) => void;
}
interface ColumnDef<R extends Row> {
    field: string;
    label?: string;
    valueGetter?: (row: Partial<R>) => unknown;
    valueSetter?: (row: Partial<R>, value: unknown) => Partial<R>;
    Renderer?: (rendererProps: { field: string; row: Partial<R>; value: unknown }) => JSX.Element;
    /**
     * @default TextField
     */
    Editor?: (rendererProps: FieldEditorProps<R>) => JSX.Element;
    isEditable?: ((row: Partial<R>) => boolean) | boolean;
}

function DefaultEditor<R extends Row>(props: FieldEditorProps<R>) {
    const { field, value, onChange } = props;
    return (
        <TextField
            aria-label={field}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            fullWidth={true}
        />
    )
}

function BooleanEditor<R extends Row>(props: FieldEditorProps<R>) {
    const { field, value, onChange } = props;
    return (
        <Checkbox
            aria-label={field}
            checked={Boolean(value)}
            onChange={(e, next) => onChange(next)}
        />
    )
}

interface EditableTableProps<R extends Row = Row> {
    columns: ColumnDef<R>[]
    /**
     * must be referentially stable for editing
     */
    rows: R[] | undefined;
    isLoading?: boolean;
    isSaving?: boolean;
    isDeleting?: boolean;
    onDelete?: (row: R) => void;
    onSave?: (row: R) => void;
    onAdd?: (row: Partial<R>) => void;
    /**
     * @default 'Add Row'
     */
    addButtonLabel?: ReactNode;
}

function EditableTable<R extends Row>(props: EditableTableProps<R>) {
    const {
        columns,
        rows,
        isLoading,
        onDelete,
        onSave,
        onAdd,
        addButtonLabel = 'Add Row'
    } = props;

    const [rowForEditing, setRowForEditing] = useState<R | null>(null);

    useEffect(() => {
        setRowForEditing(null);
    }, [rows]);

    const rowsToDisplay = useMemo(() => {
        if (isLoading && !rows?.length) {
            return [{ id: undefined } as R];
        }

        if (!rowForEditing) {
            return rows ?? [];
        }

        if (rowForEditing.id === undefined) {
            return [...(rows ?? []), rowForEditing]
        }

        return (rows ?? []).map((row) => {
            if (row.id === rowForEditing.id) {
                return rowForEditing;
            }
            return row;
        });
    }, [rows, rowForEditing, isLoading]);

    return (
        <Stack spacing={1}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field}>
                                {column.label ?? column.field}
                            </TableCell>
                        ))}
                        <TableCell padding='none' sx={{ width: '120px' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsToDisplay.map((originalRow) => {
                        let isEditingRow = false;
                        let isCreatingRow = false;
                        let row = originalRow;
                        if (rowForEditing && rowForEditing.id === originalRow.id) {
                            if (rowForEditing.id === undefined) {
                                isCreatingRow = true;
                            } else {
                                isEditingRow = true;
                            }
                            row = rowForEditing
                        }

                        return (
                            <TableRow key={row.id ?? 'none'}>
                                {columns.map(({
                                    field,
                                    Renderer,
                                    Editor = DefaultEditor,
                                    valueGetter = (row) => row[field],
                                    valueSetter = (row, nextValue) => ({ ...row, [field]: nextValue }),
                                    isEditable: getIsEditable = false,
                                }) => {
                                    if (isLoading) {
                                        return (
                                            <TableCell key={field}>
                                                <Skeleton />
                                            </TableCell>
                                        )
                                    }

                                    let isEditableCell = typeof getIsEditable === 'boolean' ? getIsEditable : getIsEditable(row);

                                    let value = valueGetter(row);

                                    if ((isEditingRow || isCreatingRow) && isEditableCell) {
                                        return (
                                            <TableCell key={field} padding='none'>
                                                <Editor
                                                    field={field}
                                                    value={value}
                                                    row={row}
                                                    onChange={(next) => setRowForEditing(prev => valueSetter(prev!, next) as R)}
                                                />
                                            </TableCell>
                                        )
                                    }
                                    if (Renderer) {
                                        return <TableCell key={field}><Renderer field={field} row={row} value={value} /></TableCell>
                                    }

                                    return <TableCell key={field}>{String(value ?? '')}</TableCell>
                                })}
                                <TableCell padding='none'>
                                    {(isEditingRow || isCreatingRow) && (
                                        <Box display='inline-flex' gap={0.5}>
                                            <Button
                                                onClick={() => (isCreatingRow ? onAdd : onSave)?.(rowForEditing!)}
                                                size='small'
                                            >
                                                {isCreatingRow ? 'Add' : 'Save'}
                                            </Button>
                                            <Button
                                                onClick={() => setRowForEditing(null)}
                                                color='error'
                                                size='small'
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    )}
                                    {!(isEditingRow || isCreatingRow) && (
                                        <>
                                            <IconButton
                                                onClick={() => setRowForEditing({ ...row })}
                                                aria-label='edit row'
                                            >
                                                <Edit />
                                            </IconButton>
                                            <ConfirmButton
                                                onClick={() => onDelete?.(row)}
                                                confirmText='Confirm delete row?'
                                                icon={true}
                                                aria-label='delete row'
                                            >
                                                <Delete />
                                            </ConfirmButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {(!rows?.length && !isLoading) && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1}>
                                No rows to show.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button
                sx={{ alignSelf: 'start' }}
                onClick={() => setRowForEditing({ id: undefined } as R)}
            >
                {addButtonLabel}
            </Button>
        </Stack>
    )
}

export { EditableTable, BooleanEditor };
export type { EditableTableProps, ColumnDef };
