import * as React from "react";
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

import AdDesc from "./AdDesc";

export default function Schedule(props) {
  const [adMaster, setAdMaster] = React.useState("");
  const [adType, setAdType] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [frequency, setFrequency] = React.useState("");
  const [tableData, setTableData] = React.useState([]);

  const handleSubmit = () => {
    const newRow = {
      id: tableData.length + 1,
      adMaster,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
      startTime: startTime ? startTime.format("HH:mm") : "",
      endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
      endTime: endTime ? endTime.format("HH:mm") : "",
      frequency,
    };
    setTableData([...tableData, newRow]);
    console.log([...tableData, newRow]); // Log the new table data for debugging
  };

  const freqvals = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
  const adtypes = ["Lband", "Aston", "Bug"];
  const values1 = localStorage.getItem("tableData");
  console.log(values1);

  return (
    <>
      <AdDesc />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="pt-10 flex justify-center items-center mx-20">
          <div className="grid grid-cols-4 grid-rows-2 gap-10 items-center">
            <div>
              <InputLabel id="adMaster">Ad Master</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  label="Ad Master"
                  labelid="adMaster"
                  name="adMaster"
                  value={adMaster}
                  onChange={(event) => setAdMaster(event.target.value)}
                >
                  {adtypes.map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
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
            </div>
            <div>
              <InputLabel id="startdate">Start Date</InputLabel>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="starttime">Start Time</InputLabel>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(time) => setStartTime(time)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="frequency">Frequency</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  label="frequency"
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
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="endtime">End Time</InputLabel>
              <TimePicker
                label="End Time"
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
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </LocalizationProvider>
    </>
  );
}
