import { Delete } from '@mui/icons-material';
import { TableHead, Table, TableBody, TableCell, TableRow, TextField, Link, IconButton } from '@mui/material';
import React, { useState } from 'react';

interface AliasesEditorProps {
    aliases: { url: string }[] | undefined;
    onChange: (nextAliases: { url: string }[]) => void;
}

function AliasesEditor(props: AliasesEditorProps) {
    const { aliases, onChange } = props;
    const [input, setInput] = useState('');

    const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code == 'Enter') {
            onChange([...aliases ?? [], { url: (e.target as HTMLInputElement).value }]);
            setInput('');
        }
    };

    const handleDelete = (index: number) => {
        onChange([
            ...(aliases ?? []).slice(0, index),
            ...(aliases ?? []).slice(index + 1),
        ]);
    };

    return (
        <>
            <TextField
                label='Add alias (url)'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={handleAdd}
                fullWidth={true}
            />
            {Boolean(aliases?.length) && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>url</TableCell>
                            <TableCell>remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {aliases!.map(({ url }, i) => (
                            <TableRow key={url}>
                                <TableCell>
                                    <Link href={url}>{url}</Link>
                                </TableCell>
                                <TableCell padding='none'>
                                    <IconButton
                                        onClick={() => handleDelete(i)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}

export { AliasesEditor };
export type { AliasesEditorProps };
