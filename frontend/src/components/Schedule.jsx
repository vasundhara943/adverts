import * as React from "react";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

import dayjs from "dayjs";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import FileInput from "./FileInput";

export default function Schedule(props) {
  const [tapeID, setTapeID] = React.useState("");
  const [adMaster, setAdMaster] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [frequency, setFrequency] = React.useState("");

  const [tableData, setTableData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [masterList, setMasterList] = React.useState([]);
  const [tapeList, setTapeList] = React.useState([]);

  const [startDateLimit, setStartDateLimit] = React.useState([]);
  const [endDateLimit, setEndDateLimit] = React.useState([]);
  const [editId, setEditId] = React.useState(null);

  const [copyList, setCopyList] = useState(tableData);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchDate, setSearchDate] = React.useState(dayjs(new Date()));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const requestSearch = async (searched) => {
    if(searched){
      setCopyList(
        (copyList.length > 0 ? copyList : tableData).filter((item) =>
          item.adMaster.toLowerCase().includes(searched.toLowerCase())
        )
      );  
    } else {
      setCopyList(tableData);
    }
  };

  const getRecords = async (searchDate) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/schedule/get/${dayjs(searchDate).format(
          "YYYY-MM-DD"
        )}`
      );
      if (Array.isArray(response.data.data)) {
        console.log(response.data.data);
        setCopyList([]);
        setTableData(response.data.data);
      } else {
        console.error("Data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId !== null) {
        await axios.put(`http://localhost:8000/schedule/update/${editId}`, {
          tapeID,
          adMaster,
          startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
          startTime: startTime ? startTime.format("HH:mm:ss") : null,
          endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
          endTime: endTime ? endTime.format("HH:mm:ss") : null,
          frequency,
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8000/schedule/add", {
          tapeID,
          adMaster,
          startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
          startTime: startTime ? startTime.format("HH:mm:ss") : null,
          endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
          endTime: endTime ? endTime.format("HH:mm:ss") : null,
          frequency,
        });
      }

      const updatedData = await axios.get("http://localhost:8000/schedule/get");
      if (Array.isArray(updatedData.data.data)) {
        setTableData(updatedData.data.data);
      } else {
        console.error("Updated data is not an array:", updatedData.data);
      }
      setTapeID("");
      setAdMaster("");
      setStartDate(null);
      setStartTime(null);
      setEndDate(null);
      setEndTime(null);
      setFrequency("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const setStartEndDateLimit = (e) => {
    const val = masterList.indexOf(e);
    setStartDateLimit(masterData[val].startdate);
    setEndDateLimit(masterData[val].enddate);
  };

  const editValues = (id) => {
    const record = tableData.find((row) => row.id === id);
    if (record) {
      setTapeID(record.tapeID);
      setAdMaster(record.adMaster);
      setStartEndDateLimit(record.adMaster);
      setStartDate(dayjs(record.startDate));
      setStartTime(dayjs(record.startTime, "HH:mm:ss"));
      setEndDate(dayjs(record.endDate));
      setEndTime(dayjs(record.endTime, "HH:mm:ss"));
      setFrequency(record.frequency);
      setEditId(id);
    }
  };

  const deleteRecord = async (id) => {
    await axios.delete(`http://localhost:8000/schedule/delete/${id}`);
    const updatedData = await axios.get("http://localhost:8000/schedule/get");
    if (Array.isArray(updatedData.data.data)) {
      setTableData(updatedData.data.data);
    } else {
      console.error("Updated data is not an array:", updatedData.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/schedule/get/${dayjs(new Date()).format(
            "YYYY-MM-DD"
          )}`
        );
        //console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
        } else {
          console.error("Data is not an array:", response.data);
        }

        const response1 = await axios.get(
          "http://localhost:8000/admaster/getactive"
        );
        //console.log("Response:", response1.data);
        if (Array.isArray(response1.data.data)) {
          setMasterData(response1.data.data);
          setTapeList(response1.data.data.map((row) => row.tapeID));
          setMasterList(
            response1.data.data.map(
              (row) => `${row.channel}_${row.name}_${row.adtype}`
            )
          );
        } else {
          console.error("Data is not an array:", response1.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const freqvals = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <div>
          <div className="pt-10 flex justify-center items-center">
            <FileInput />
          </div>
        </div>
        <div className="pt-10 justify-center mx-20 grid gap-7 2xl:gap-10 items-center grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <div className="font-bold text-xl row-span-2">
            <h2>Manual Scheduling:</h2>
          </div>
          <div>
            <InputLabel id="tapeid">Tape ID</InputLabel>
            <FormControl sx={{ width: "200px" }}>
              <Select
                labelid="tapeID"
                name="tapeID"
                value={tapeID}
                onChange={(event) => {
                  setTapeID(event.target.value);
                  setAdMaster(event.target.value);
                }}
              >
                {tapeList.map((val, index) => (
                  <MenuItem key={index} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <InputLabel id="adMaster">Ad Master</InputLabel>
            <FormControl sx={{ width: "200px" }}>
              <Select
                labelid="adMaster"
                name="adMaster"
                value={adMaster}
                onChange={(event) => {
                  setAdMaster(event.target.value);
                  setStartEndDateLimit(event.target.value);
                }}
              >
                {masterList.map((val, index) => (
                  <MenuItem key={index} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <InputLabel id="startdate">Start Date</InputLabel>
            <DatePicker
              sx={{ width: "200px" }}
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
              minDate={dayjs(startDateLimit)}
              maxDate={dayjs(endDateLimit)}
            />
          </div>
          <div>
            <InputLabel id="starttime">Start Time</InputLabel>
            <TimePicker
              sx={{ width: "200px" }}
              value={startTime}
              onChange={(time) => setStartTime(time)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div>
            <InputLabel id="frequency">Frequency</InputLabel>
            <FormControl sx={{ width: "200px" }}>
              <Select
                labelid="frequency"
                name="frequency"
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
              >
                {freqvals.map((val, index) => (
                  <MenuItem key={index} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <InputLabel id="enddate">End Date</InputLabel>
            <DatePicker
              sx={{ width: "200px" }}
              value={endDate}
              minDate={dayjs(startDateLimit)}
              maxDate={dayjs(endDateLimit)}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div>
            <InputLabel id="endtime">End Time</InputLabel>
            <TimePicker
              sx={{ width: "200px" }}
              value={endTime}
              onChange={(time) => setEndTime(time)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div className="pt-10 flex justify-center items-center ">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#a10000",
              }}
            >
              {editId !== null ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
        <div className="pt-10 mx-20 grid grid-cols-4 justify-center items-center">
          <div className="cols-span-1"></div>
          <div className="pt-10 flex justify-center items-center">
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
          </div>
          <div className="pt-10 flex justify-center items-center">
            <div>
              <InputLabel>Search in Ad Master</InputLabel>
              <TextField
                variant="outlined"
                placeholder="Search..."
                type="search"
                onInput={(e) => requestSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pt-10 flex justify-center items-center">
          <Table sx={{ minWidth: 500, width: "1150px", margin: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tape ID</TableCell>
                <TableCell>Ad Master</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(copyList.length > 0 ? copyList : tableData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.tapeID}</TableCell>
                    <TableCell>{row.adMaster}</TableCell>
                    <TableCell>
                      {dayjs(row.startDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{row.startTime}</TableCell>
                    <TableCell>
                      {dayjs(row.endDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{row.endTime}</TableCell>
                    <TableCell>{row.frequency}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => editValues(row.id)}
                        sx={{
                          color: "#a10000",
                        }}
                      >
                        <CiEdit />
                      </Button>
                      <Button
                        onClick={() => deleteRecord(row.id)}
                        sx={{
                          color: "#a10000",
                        }}
                      >
                        <MdDeleteForever />
                      </Button>
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
}
