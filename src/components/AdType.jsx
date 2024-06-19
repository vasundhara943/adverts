import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name) {
  return { name };
}

const rows = [
  createData("L Band"),
  createData("Aston"),
  createData("Bug"),
];

const AdType = () => {
  return (
    <>
      <div className="pt-10 flex justify-center items-center">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "60ch", maxWidth: "90%" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Ad Type" variant="outlined" />
        </Box>
        <Button
          variant="contained"
          sx={{
            padding: "12px",
            width: "100px",
            height: "54px",
          }}
        >
          Save
        </Button>
      </div>
      <div className="pt-10 justify-center items-center">
          <Table
            sx={{ minWidth: 500, width: '550px',  margin: "auto"}}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Ad Type</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell align="center" component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  {/* <StyledTableCell align="right">{row.calories}</StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    </>
  );
};

export default AdType;
