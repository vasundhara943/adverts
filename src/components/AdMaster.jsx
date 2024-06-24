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

export default function AdMaster() {
  const [channel, setChannel] = React.useState("")
  const [aname, setAname] = React.useState("");
  const [adtype, setAdtype] = React.useState("");
  const [filePath, setFilePath] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [active, setActive] = React.useState(true);

  const [tableData, setTableData] = React.useState([]);
  const [values, setAdtypeList] = React.useState([]);
  const [channelList, setChannelList] = React.useState([])

  const handleSubmit = () => {
    const newRow = {
      id: tableData.length + 1,
      aname,
      adtype,
      filePath,
      startDate,
      endDate,
      active,
    };
    setTableData([...tableData, newRow]);
    // console.log([...tableData, newRow]); // Log the new table data for debugging
    localStorage.setItem("tableData", JSON.stringify([...tableData, newRow]));
  };

  useEffect(() => {
    const values1 = localStorage.getItem("AdType");
    if (values1) {
      // console.log(values1);
      setChannelList(JSON.parse(values1).map((val) => val.cname));
      setAdtypeList(JSON.parse(values1).map((val) => val.adtype));
      // setStartDateLimit(JSON.parse(values1).map((val) => val.startDate));
      // setEndDateLimit(JSON.parse(values1).map((val) => val.endDate));
    }
  }, []);

  const editValues = (id) => {
    
  }
  //const values = ["Lband", "Aston", "Bug"];

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="pt-10 flex justify-center items-center mx-20">
          <div className="grid grid-cols-4 grid-rows-2 gap-10 items-center">
          <div>
              <InputLabel id="adtype">Channel</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
                  label="Channel"
                  labelid="channel"
                  name="channel"
                  value={channel}
                  onChange={(event) => setChannel(event.target.value)}
                >
                  {channelList.map((val, index) => (
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
                onChange={(aname) => setAname(aname.target.value)}
              />
            </div>
            <div>
              <InputLabel id="adtype">Ad Type</InputLabel>
              <FormControl sx={{ width: "280px" }}>
                <Select
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
                </Select>
              </FormControl>
            </div>
            <div>
              <InputLabel id="filepath">File Path</InputLabel>
              <TextField
                id="filePath"
                value={filePath}
                onChange={(filePath) => setFilePath(filePath.target.value)}
              />
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
              <InputLabel id="enddate">End Date</InputLabel>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="active">Active?</InputLabel>
              <Switch
                labelid="active"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
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
                <TableCell>Name</TableCell>
                <TableCell>Ad Type</TableCell>
                <TableCell>File Path</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.aname}</TableCell>
                  <TableCell>{row.adtype}</TableCell>
                  <TableCell>{row.filePath}</TableCell>
                  <TableCell>
                    {row.startDate ? startDate.format("YYYY-MM-DD") : ""}
                  </TableCell>
                  <TableCell>
                    {row.endDate ? endDate.format("YYYY-MM-DD") : ""}
                  </TableCell>
                  <TableCell>{row.active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={editValues(row.id)}
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
