import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import dayjs from 'dayjs';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(type, sdate, stime, edate, etime, active) {
  const isActive = active ? 'Yes' : 'No'
  return { type, sdate, stime, edate, etime, isActive};
}

const rows = [
  createData('L Band', '2022-04-17', "15:30", '2022-04-17', "15:30", true),
  createData('L Band', '2022-04-17', "15:30", '2022-04-17', "15:30", true),
  createData('L Band', '2022-04-17', "15:30", '2022-04-17', "15:30", true),
  createData('L Band', '2022-04-17', "15:30", '2022-04-17', "15:30", true)
];

export default function CreateTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} >
        <TableHead>
          <TableRow>
            <StyledTableCell>Ad Type</StyledTableCell>
            <StyledTableCell align="right">Start Date</StyledTableCell>
            <StyledTableCell align="right">Start Time</StyledTableCell>
            <StyledTableCell align="right">End Date</StyledTableCell>
            <StyledTableCell align="right">End Time</StyledTableCell>
            <StyledTableCell align='right'>Active</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.type}>
              <StyledTableCell component="th" scope="row">
                {row.type}
              </StyledTableCell>
              <StyledTableCell align="right">{row.sdate}</StyledTableCell>
              <StyledTableCell align="right">{row.stime}</StyledTableCell>
              <StyledTableCell align="right">{row.edate}</StyledTableCell>
              <StyledTableCell align="right">{row.etime}</StyledTableCell>
              <StyledTableCell align="right">{row.isActive}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
