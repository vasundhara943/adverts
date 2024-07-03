import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FormControl, Select, MenuItem, InputLabel, TextField } from "@mui/material";

import AdDesc from "./AdDesc";

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

// const values = ["Lband", "Aston", "Bug"];

const AdType = () => {
  const [adtype, setAdtype] = React.useState("");
  const [tableData, setTableData] = React.useState([]);
  const [cname, setCname] = React.useState("");
  const [carryData, setCarryData] = React.useState([]);

  const handleSubmit = () => {
    const newRow = {
      id: tableData.length + 1,
      cname,
      adtype
    };

    // setCarryData([...carryData, adtype])
    setTableData([...tableData, newRow]);
    console.log([...tableData, newRow]);
    localStorage.setItem("AdType", JSON.stringify([...tableData,newRow]))
  };

  return (
    <>
        {/* <AdDesc/> */}
      
        <div className="pt-10 flex justify-center items-center mx-20">
        <div className="grid grid-cols-2 grid-rows-1 gap-10 items-center">
          <div>
            <InputLabel id="cname">Channel Name</InputLabel>
            <TextField
              id="cname"
              value={cname}
              onChange={(cname) => setCname(cname.target.value)}
            />
          </div>
          <div>
            <InputLabel id="adtype">Ad Type</InputLabel>
            <FormControl sx={{ width: "280px" }}>
              {/* <Select
                label="Ad Type"
                labelid="adtype"
                name="adtype"
                value={adtype}
                onChange={(event) => setAdtype(event.target.value)}
              >
                {values.map((val, index) => (
                  <MenuItem key={index} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select> */}
              <TextField
              id="adtype"
              value={adtype}
              onChange={(type) => setAdtype(type.target.value)}
            />
            </FormControl>
          </div>
          </div>
      </div>
      <div className="pt-10 flex justify-center items-center">
        <Button
          variant="contained"
          sx={{
            padding: "12px",
            width: "100px",
            height: "54px",
          }}
          onClick={handleSubmit}
        >
          Save
        </Button>
        </div>
      <div className="pt-10 justify-center items-center">
          <Table sx={{ minWidth: 500, width: '550px',  margin: "auto"}} >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Channel Name</TableCell>
                <TableCell>Ad Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.cname}</TableCell>
                  <TableCell>{row.adtype}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    </>
  );
};

export default AdType;
