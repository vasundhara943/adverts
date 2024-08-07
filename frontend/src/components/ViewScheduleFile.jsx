import React, { useEffect } from "react";
import {
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  Button,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExcelExport from "./ExcelExport";

const ViewScheduleFile = () => {
  const [tableData, setTableData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [copyList, setCopyList] = React.useState([]);
  const [searchDate, setSearchDate] = React.useState(dayjs(new Date()));

  const columnMapping = {
    id: "ID",
    dateStr: "File Date",
    telecastTime: "Telecast Time",
    timebandName: "Timeband Name",
    requestedTimebandName: "Requested Timeband Name",
    adType: "Type",
    tapeID: "Tape ID",
    eventName: "Event",
    clientName: "Client Name",
    duration: "Duration",
    contentType: "Content Type",
    productName: "Product Name",
    bookedProgram: "Booked Program",
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const requestSearch = async (searched) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/schedule/getfilterfile/${dayjs(searched).format(
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
      const today = new Date();
      try {
        const response = await axios.post(
          `http://localhost:8000/schedule/getfilterfile/${dayjs(
            new Date()
          ).format("YYYY-MM-DD")}`
        );
        //console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          console.log(response.data.data);
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
        <div className="pt-10 mx-20 justify-center items-center grid grid-cols-4">
          <div className="col-span-1"></div>
          <div>
            <InputLabel>Filter by Date</InputLabel>
            <DatePicker
              value={searchDate}
              sx={{ width: "200px" }}
              onChange={(date) => {
                setSearchDate(date);
                requestSearch(date);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div className="pt-5 flex justify-center items-center">
            <ExcelExport
              data={(copyList.length > 0 ? copyList : tableData)}
              columnMapping={columnMapping}
              fileName={`NDTV Schedule ${dayjs(searchDate).format(
                "YYYY-MM-DD"
              )}`}
            />
          </div>
        </div>
        <div className="pt-10 flex justify-center items-center">
          <Table sx={{ minWidth: 500, width: "1150px", margin: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>File Date</TableCell>
                <TableCell>Telecast Time</TableCell>
                <TableCell>Timeband Name</TableCell>
                <TableCell>Requested Timeband Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Tape ID</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Content Type</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Booked Program</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(copyList.length > 0 ? copyList : tableData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.dateStr}</TableCell>
                    <TableCell>{row.telecastTime}</TableCell>
                    <TableCell>{row.timebandName}</TableCell>
                    <TableCell>{row.requestedTimebandName}</TableCell>
                    <TableCell>{row.adType}</TableCell>
                    <TableCell>{row.tapeID}</TableCell>
                    <TableCell>{row.eventName}</TableCell>
                    <TableCell>{row.clientName}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell>{row.contentType}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.bookedProgram}</TableCell>
                    <TableCell>
                    </TableCell>
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

export default ViewScheduleFile;
