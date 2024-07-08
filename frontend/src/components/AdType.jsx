import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FormControl, TextField, InputLabel } from "@mui/material";

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

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdType = () => {
  const [adtype, setAdtype] = React.useState("");
  const [tableData, setTableData] = React.useState([]);
  const [cname, setCname] = React.useState("");

  console.log(tableData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get");
        console.log('Response:', response.data);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
          console.log('Table data:', response.data.data);
        } else {
          console.error('Data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const newRow = {
      id: tableData.length + 1,
      cname,
      adtype
    };
  
    // Optimistically update the table data
    setTableData([...tableData, newRow]);
    localStorage.setItem("AdType", JSON.stringify([...tableData, newRow]));
  
    try {
      const response = await axios.post("http://localhost:8000/add", {
        cname,
        adtype
      });
      console.log('Response:', response.data);
      // Refetch the table data to ensure consistency
      const updatedData = await axios.get("http://localhost:8000/get");
      if (Array.isArray(updatedData.data.data)) {
        setTableData(updatedData.data.data);
      } else {
        console.error('Updated data is not an array:', updatedData.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="pt-10 flex justify-center items-center mx-20">
        <div className="grid grid-cols-2 grid-rows-1 gap-10 items-center">
          <div>
            <InputLabel id="cname">Channel Name</InputLabel>
            <TextField
              id="cname"
              value={cname}
              onChange={(event) => setCname(event.target.value)}
            />
          </div>
          <div>
            <InputLabel id="adtype">Ad Type</InputLabel>
            <FormControl sx={{ width: "280px" }}>
              <TextField
                id="adtype"
                value={adtype}
                onChange={(event) => setAdtype(event.target.value)}
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
        <Table sx={{ minWidth: 500, width: '550px', margin: "auto" }} >
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Channel Name</StyledTableCell>
              <StyledTableCell>Ad Type</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(tableData) && tableData.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.channel}</StyledTableCell>
                <StyledTableCell>{row.adtype}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdType;
