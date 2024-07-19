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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import dayjs from "dayjs";

import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

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

  const [editId, setEditId] = React.useState(null);

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

  const requestSearchChannel = (searched) => {
    setCopyList(
      ((copyList.length > 0) && (searched != "") ? copyList : tableData).filter(
        (item) => item.channel.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const requestSearchName = (searched) => {
    setCopyList(
      ((copyList.length > 0) && (searched != "") ? copyList : tableData).filter(
        (item) => item.name.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const requestSearchAdType = (searched) => {
    setCopyList(
      ((copyList.length > 0) && (searched != "") ? copyList : tableData).filter(
        (item) => item.adtype.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const handleSubmit = async () => {
    try {
      if (editId !== null) {
        // Update record
        await axios.post(`http://localhost:8000/admaster/update/${editId}`, {
          channel,
          aname,
          adtype,
          filePath,
          startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
          endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
          active,
        });
        setEditId(null);
      } else {
        // New record
        await axios.post("http://localhost:8000/admaster/add", {
          channel,
          aname,
          adtype,
          filePath,
          startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
          endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
          active,
        });
      }

      // Refetch table
      const updatedData = await axios.get("http://localhost:8000/admaster/get");
      if (Array.isArray(updatedData.data.data)) {
        setTableData(updatedData.data.data);
      } else {
        console.error("Updated data is not an array:", updatedData.data);
      }

      // Reset fields
      setChannel("");
      setAname("");
      setAdtype("");
      setFilePath("");
      setStartDate(null);
      setEndDate(null);
      setActive("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admaster/get");
        console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
          console.log("Table data:", response.data.data);
        } else {
          console.error("Data is not an array:", response.data);
        }

        const response1 = await axios.get(
          "http://localhost:8000/adtype/getadlist"
        );
        console.log("Response:", response1.data);
        if (Array.isArray(response1.data.data)) {
          setAdtypeList(response1.data.data.map((row) => row.adtype));
          console.log("AdType data:", response1.data.data);
        } else {
          console.error("Data is not an array:", response1.data);
        }

        const response2 = await axios.get(
          "http://localhost:8000/adtype/getchannellist"
        );
        console.log("Response:", response2.data);
        if (Array.isArray(response2.data.data)) {
          setChannelList(response2.data.data.map((row) => row.channel));
          console.log("Channel data:", response2.data.data);
        } else {
          console.error("Data is not an array:", response2.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const editValues = (id) => {
    const row = tableData.find((row) => row.id === id);
    if (row) {
      setChannel(row.channel);
      setAname(row.name);
      setAdtype(row.adtype);
      setFilePath(row.filepath);
      setStartDate(dayjs(row.startdate));
      setEndDate(dayjs(row.enddate));
      setActive(row.active);
      setEditId(id);
    }
  };

  const deleteRecord = async (id) => {
    await axios.delete(`http://localhost:8000/admaster/delete/${id}`);
    const updatedData = await axios.get("http://localhost:8000/admaster/get");
    if (Array.isArray(updatedData.data.data)) {
      setTableData(updatedData.data.data);
    } else {
      console.error("Updated data is not an array:", updatedData.data);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <div className="pt-10 flex justify-center items-center mx-20">
          <div className="grid grid-cols-4 grid-rows-2 gap-10 items-center">
            <div>
              <InputLabel id="channel">Channel</InputLabel>
              <FormControl sx={{ width: "200px" }}>
                <Select
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
                sx={{ width: "200px" }}
                id="aname"
                value={aname}
                onChange={(event) => setAname(event.target.value)}
              />
            </div>
            <div>
              <InputLabel id="adtype">Ad Type</InputLabel>
              <FormControl sx={{ width: "200px" }}>
                <Select
                  value={adtype}
                  onChange={(event) => setAdtype(event.target.value)}
                >
                  {adtypelist.map((val, index) => (
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
                sx={{ width: "200px" }}
                value={filePath}
                onChange={(event) => setFilePath(event.target.value)}
              />
            </div>
            <div>
              <InputLabel id="startdate">Start Date</InputLabel>
              <DatePicker
                sx={{ width: "200px" }}
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="enddate">End Date</InputLabel>
              <DatePicker
                sx={{ width: "200px" }}
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel id="active">Active?</InputLabel>
              <FormControl sx={{ width: "200px" }}>
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
            <div className="pt-10 flex justify-center items-center">
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
        </div>

        <div className="pt-10 flex gap-10 justify-center items-center">
          <div>
            <InputLabel>Search Channel</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchChannel(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>Search Name</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchName(e.target.value)}
            />
          </div>
          <div>
            <InputLabel>Search Ad Type</InputLabel>
            <TextField
              variant="outlined"
              placeholder="Search..."
              type="search"
              onInput={(e) => requestSearchAdType(e.target.value)}
            />
          </div>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(copyList.length > 0 ? copyList : tableData).slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.adtype}</TableCell>
                  <TableCell>{row.filepath}</TableCell>
                  <TableCell>
                    {dayjs(row.startdate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {dayjs(row.enddate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{row.active}</TableCell>
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
            count={(copyList.length>0 ? copyList : tableData).length}
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
