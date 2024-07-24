import React from "react";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

import dayjs from "dayjs";
import axios from "axios";

const AsRunLog = () => {
  const [tableData, setTableData] = React.useState([]);
  const [copyList, setCopyList] = useState(tableData);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const requestSearchEndDate = (searched) => {
    setCopyList(
      (copyList.length > 0 && searched != "" ? copyList : tableData).filter(
        (item) => item.endDate.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const requestSearchStartDate = (searched) => {
    setCopyList(
      (copyList.length > 0 && searched != "" ? copyList : tableData).filter(
        (item) => item.startDate.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const requestSearchAdMaster = (searched) => {
    setCopyList(
      (copyList.length > 0 && searched != "" ? copyList : tableData).filter(
        (item) => item.adMaster.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/asrunlog/get");
        //console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
          //console.log("Table data:", response.data.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <div className="pt-10 flex gap-10 justify-center items-center">
          <div>
            <InputLabel>Search in Ad Master</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchAdMaster(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>Search Start Date</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchStartDate(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>Search End Date</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="pt-10 flex justify-center items-center">
          <Table sx={{ minWidth: 500, width: "1150px", margin: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ad Master</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
              (copyList.length > 0 ? copyList : tableData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.adMaster}</TableCell>
                    <TableCell>
                      {dayjs(row.startDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{row.startTime}</TableCell>
                    <TableCell>
                      {dayjs(row.endDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{row.endTime}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="pt-10 flex justify-center items-center">
          <TablePagination
            component="div"
            count={(copyList.length > 0 ? copyList : tableData).length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </LocalizationProvider>
    </>
  );
};

export default AsRunLog;
