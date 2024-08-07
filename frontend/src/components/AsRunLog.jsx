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

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

import dayjs from "dayjs";
import axios from "axios";
import ExcelExport from "./ExcelExport";

const AsRunLog = () => {
  const [tableData, setTableData] = React.useState([]);
  const [copyList, setCopyList] = useState(tableData);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchDate, setSearchDate] = React.useState(dayjs(new Date()));

  const columnMapping = {
    id: "RowID",
    reconKey: "ReconKey",
    telecastDate: "Telecast date",
    tapeID: "Clip ID",
    eventName: "Caption",
    telecastTime: "Telecast Time",
    duration: "Duration",
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const requestSearchTapeID = (searched) => {
    setCopyList(
      (copyList.length > 0 && searched != "" ? copyList : tableData).filter(
        (item) => item.startDate.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const requestSearchAdName = (searched) => {
    setCopyList(
      (copyList.length > 0 && searched != "" ? copyList : tableData).filter(
        (item) => item.adMaster.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const getRecords = async (searchDate) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/asrunlog/get/${dayjs(searchDate).format(
          "YYYY-MM-DD"
        )}`
      );
      if (Array.isArray(response.data.data)) {
        console.log(response.data.data);
        setCopyList(response.data.data);
      } else {
        console.error("Data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/asrunlog/get/${dayjs(new Date()).format(
            "YYYY-MM-DD"
          )}`
        );
        //console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
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
            <InputLabel>Filter by Date</InputLabel>
            <DatePicker
              value={searchDate}
              sx={{ width: "200px" }}
              onChange={(date) => {
                setSearchDate(date);
                getRecords(date);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div>
            <InputLabel>Search Caption</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchAdName(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>Search Tape ID</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchTapeID(e.target.value)}
            />
          </div>
          <div>
            <ExcelExport data={(copyList.length > 0 ? copyList : tableData)}
              columnMapping={columnMapping}
              fileName={`NDTV As Run Log ${dayjs(searchDate).format(
                "YYYY-MM-DD"
              )}`} />
          </div>
        </div>
        <div className="pt-10 flex justify-center items-center">
          <Table sx={{ minWidth: 500, width: "1150px", margin: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>Row ID</TableCell>
                <TableCell>ReconKey</TableCell>
                <TableCell>Telecast Date</TableCell>
                <TableCell>Tape ID</TableCell>
                <TableCell>Caption</TableCell>
                <TableCell>Telecast Time</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(copyList.length > 0 ? copyList : tableData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.reconKey}</TableCell>
                    <TableCell>
                      {dayjs(row.telecastDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{row.tapeID}</TableCell>
                    <TableCell> {row.eventName}</TableCell>
                    <TableCell>{row.telecastTime}</TableCell>
                    <TableCell>{row.duration}</TableCell>
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
