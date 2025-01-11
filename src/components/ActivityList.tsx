import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TablePagination } from '@mui/material';
import React, { useState } from 'react';
import { useFetchActivity } from '../queries';
import { RelativeDate } from './RelativeDate';

function ActivityList() {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const { data: activity } = useFetchActivity(
        { take: rowsPerPage, skip: page * rowsPerPage },
        { select: response => response.activity }
    );

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>created</TableCell>
                            <TableCell>user</TableCell>
                            <TableCell>drama id</TableCell>
                            <TableCell>drama title</TableCell>
                            <TableCell>message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activity?.data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <RelativeDate>{row.createdAt}</RelativeDate>
                                </TableCell>
                                <TableCell>{row.createdBy?.email}</TableCell>
                                <TableCell>{row.dramaId}</TableCell>
                                <TableCell>{row.drama?.title}</TableCell>
                                <TableCell sx={{ whiteSpace: 'break-spaces' }}>{row.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                component="div"
                count={activity?.meta.total ?? -1}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, next) => setPage(next)}
                onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
            />
        </>
    )
}

export { ActivityList };