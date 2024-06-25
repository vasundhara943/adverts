import * as React from "react";
import { useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import {
  Switch,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';

import dayjs from "dayjs";

import AdDesc from "./AdDesc";
import EditBtn from "./EditBtn";

export default function Schedule(props) {
  const [adMaster, setAdMaster] = React.useState("");
  const [adType, setAdType] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [frequency, setFrequency] = React.useState("");

  const [values, setValues] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [cnames, setCnames] = React.useState([]);

  const [startDateLimit, setStartDateLimit] = React.useState([]);
  const [endDateLimit, setEndDateLimit] = React.useState([]);

  const handleSubmit = () => {
    const newRow = {
      id:tableData.length + 1,
      adMaster,
      startDate,
      startTime,
      endDate,
      endTime,
      frequency,
    };
    setTableData([...tableData, newRow]);
    console.log([...tableData, newRow]);
  };

  const setStartEndDateLimit = (e) => {
    // const val = event.target.children[event.target.selectedIndex].id;
    const val = cnames.indexOf(e);
    console.log(values[val]);
    setStartDateLimit(values[val].startDate);
    setEndDateLimit(values[val].endDate);
  }

  const editValues = (id) => {
    setAdMaster(tableData[id - 1].adMaster);
    setStartDate(tableData[id - 1].startDate);
    setStartTime(tableData[id - 1].startTime);
    setEndDate(tableData[id - 1].endDate);
    setEndTime(tableData[id - 1].endTime);
    setFrequency(tableData[id - 1].frequency);
  };

  useEffect(() => {
    //const values1 = localStorage.getItem("tableData");
    const values2 = localStorage.getItem("carry");

    if (values2) {
      setValues(JSON.parse(values2));
      setCnames(JSON.parse(values2).map((val) => val.str));
      console.log(values);
      console.log(cnames);
      
    }
    // if (values1) {
    //   const val1 = JSON.parse(values1);
    //   //setAdtypeList(JSON.parse(values1).map((val) => val.adType));
    // }
  }, []);

  const freqvals = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
  // const adtypes = Array.from(new Set(adtypelist));

  return (
    <>
      {/* <AdDesc /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <div className="pt-10 flex justify-center items-center mx-20">
          <div className="grid grid-cols-3 grid-rows-2 gap-10 items-center">
            <div>
              <InputLabel id="adMaster">Ad Master</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  // label="Ad Master"
                  labelid="adMaster"
                  name="adMaster"
                  value={adMaster}
                  onChange={(event) => {setAdMaster(event.target.value);
                    setStartEndDateLimit(event.target.value);
                  }}
                >
                  {cnames.map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* <div>
              <InputLabel id="adType">Ad Type</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  label="Ad Type"
                  labelid="adType"
                  name="adType"
                  value={adType}
                  onChange={(event) => setAdType(event.target.value)}
                >
                  {adtypes.map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
            <div>
              <InputLabel id="startdate">Start Date</InputLabel>
              <DatePicker
                // label="Start Date"
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
                // label="Start Time"
                value={startTime}
                onChange={(time) => setStartTime(time)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="frequency">Frequency</InputLabel>
              <FormControl sx={{ width: "280px" }}>
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
                // label="End Date"
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
                // label="End Time"
                value={endTime}
                onChange={(time) => setEndTime(time)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </div>
        </div>
        <div className="pt-10 flex justify-center items-center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        <div className="pt-20 flex justify-center items-center">
          <Table sx={{ minWidth: 500, width: "1150px", margin: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ad Master</TableCell>
                <TableCell>Ad Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.adMaster}</TableCell>
                  <TableCell>{row.adType}</TableCell>
                  <TableCell>
                    {row.startDate ? row.startDate.format("YYYY-MM-DD") : ""}
                  </TableCell>
                  <TableCell>
                    {row.startTime ? row.startTime.format("HH:mm") : ""}
                  </TableCell>
                  <TableCell>
                    {row.endDate ? row.endDate.format("YYYY-MM-DD") : ""}
                  </TableCell>
                  <TableCell>
                    {row.endTime ? row.endTime.format("HH:mm") : ""}
                  </TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => editValues(row.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </LocalizationProvider>
    </>
  );
}
