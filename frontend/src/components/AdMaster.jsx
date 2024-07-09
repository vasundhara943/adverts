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

import axios from "axios";

export default function AdMaster() {
  const [channel, setChannel] = React.useState("");
  const [aname, setAname] = React.useState("");
  const [adtype, setAdtype] = React.useState("");
  const [filePath, setFilePath] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [active, setActive] = React.useState("");
  const [tableData, setTableData] = React.useState([]);
  const [adtypelist, setAdtypeList] = React.useState([]);
  const [channelList, setChannelList] = React.useState([]);
  const [carryData, setCarryData] = React.useState([]);

  const handleSubmit = async () => {
    const newRow = {
      id: tableData.length + 1,
      channel,
      aname,
      adtype,
      filePath,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      active,
    };
    const str = `${channel}_${aname}_${adtype}`;
    const carryRow = {
      id: tableData.length + 1,
      str,
      filePath,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      active
    };

    setCarryData([...carryData, carryRow]);    
    setTableData([...tableData, newRow]);
    // Log the new table data for debugging
    //console.log('New row data:', newRow);
    //console.log('New carry row data:', carryRow);
    localStorage.setItem("carry", JSON.stringify([...carryData, carryRow]));

    try {
      const response = await axios.post("http://localhost:8000/admaster/add", {
        channel,
        aname,
        adtype,
        filePath,
        startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
        active
      });
      //console.log('Response:', response.data);
      // Refetch the table data to ensure consistency
      const updatedData = await axios.get("http://localhost:8000/admaster/get");
      if (Array.isArray(updatedData.data.data)) {
        setTableData(updatedData.data.data);
      } else {
        console.error('Updated data is not an array:', updatedData.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const values1 = localStorage.getItem("AdType");
    if (values1) {
      setChannelList(JSON.parse(values1).map((val) => val.channel));
      setAdtypeList(JSON.parse(values1).map((val) => val.adtype));
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:8000/admaster/get");
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
    }
  }, []);

  const editValue = (id) => {
    const row = tableData.find((row) => row.id === id);
    if (row) {
      setChannel(row.channel);
      setAname(row.aname);
      setAdtype(row.adtype);
      setFilePath(row.filePath);
      setStartDate(dayjs(row.startDate));
      setEndDate(dayjs(row.endDate));
      setActive(row.active);
    }
  }

  const values = Array.from(new Set(adtypelist));
  const channels = Array.from(new Set(channelList));

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <div className="pt-10 flex justify-center items-center mx-20">
          <div className="grid grid-cols-4 grid-rows-2 gap-10 items-center">
            <div>
              <InputLabel id="channel">Channel</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  labelid="channel"
                  name="channel"
                  value={channel}
                  onChange={(event) => setChannel(event.target.value)}
                >
                  {channels.map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <InputLabel id="aname">Ad Name</InputLabel>
              <TextField
                id="aname"
                value={aname}
                onChange={(event) => setAname(event.target.value)}
              />
            </div>
            <div>
              <InputLabel id="adtype">Ad Type</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
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
                </Select>
              </FormControl>
            </div>
            <div>
              <InputLabel id="filepath">File Path</InputLabel>
              <TextField
                id="filePath"
                value={filePath}
                onChange={(event) => setFilePath(event.target.value)}
              />
            </div>
            <div>
              <InputLabel id="startdate">Start Date</InputLabel>
              <DatePicker
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="enddate">End Date</InputLabel>
              <DatePicker
                value={endDate}
                onChange={(date) => setEndDate(date)}
                disablePast={true}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="active">Active?</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  value={active}
                  onChange={(event) => setActive(event.target.value)}
                >
                  {["Yes", "No"].map((val, index) => (
                    <MenuItem key={index} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                <TableCell>Channel</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Ad Type</TableCell>
                <TableCell>File Path</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.adtype}</TableCell>
                  <TableCell>{row.filepath}</TableCell>
                  <TableCell>{row.startdate}</TableCell>
                  <TableCell>{row.enddate}</TableCell>
                  <TableCell>{row.active}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => editValue(row.id)}>Edit</Button>
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
