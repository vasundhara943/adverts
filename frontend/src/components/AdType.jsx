import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { FormControl, TextField, InputLabel } from "@mui/material";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

const AdType = () => {
  const [channel, setChannel] = React.useState("");
  const [adtype, setAdtype] = React.useState("");

  const [tableData, setTableData] = React.useState([]);

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
      tableData.filter((item) =>
        item.channel.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };

  const requestSearchAdType = (searched) => {
    setCopyList(
      tableData.filter((item) =>
        item.adtype.toLowerCase().includes(searched.toLowerCase())
      )
    );
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/adtype/get");
        console.log("Response:", response.data);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
          console.log("Table data:", response.data.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);


  
  const handleSubmit = async () => {
    try {
      if (editId != null) {
        await axios.post(`http://localhost:8000/adtype/update/${editId}`, {
          channel,
          adtype,
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8000/adtype/add", {
          channel,
          adtype,
        });
      }
      //console.log('Response:', response.data);
      const updatedData = await axios.get("http://localhost:8000/adtype/get");
      if (Array.isArray(updatedData.data.data)) {
        setTableData(updatedData.data.data);
      } else {
        console.error("Updated data is not an array:", updatedData.data);
      }

      setChannel("");
      setAdtype("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editValues = (id) => {
    const row = tableData.find((row) => row.id === id);
    if (row) {
      setChannel(row.channel);
      setAdtype(row.adtype);
      setEditId(id);
    }
  };

  const deleteRecord = async (id) => {
    await axios.delete(`http://localhost:8000/adtype/delete/${id}`);

    const updatedData = await axios.get("http://localhost:8000/adtype/get");
    if (Array.isArray(updatedData.data.data)) {
      setTableData(updatedData.data.data);
    } else {
      console.error("Updated data is not an array:", updatedData.data);
    }
  };

  return (
    <>
      <div className="pt-10 flex justify-center items-center mx-20">
        <div className="flex gap-10 grid-cols-3 grid-rows-1 items-center">
          <div>
            <InputLabel id="channel">Channel Name</InputLabel>
            <TextField
              id="channel"
              value={channel}
              sx={{ width: "200px" }}
              onChange={(event) => setChannel(event.target.value)}
            />
          </div>
          <div>
            <InputLabel id="adtype">Ad Type</InputLabel>
            <FormControl sx={{ width: "200px" }}>
              <TextField
                id="adtype"
                value={adtype}
                onChange={(event) => setAdtype(event.target.value)}
              />
            </FormControl>
          </div>
          <div className="pt-10 flex justify-center items-center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#a10000",
              }}
              onClick={handleSubmit}
            >
              Save
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
          <InputLabel>Search Ad Type</InputLabel>
          <TextField
            variant="outlined"
            placeholder="Search..."
            type="search"
            onInput={(e) => requestSearchAdType(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-10 justify-center items-center">
        <Table sx={{ minWidth: 500, width: "550px", margin: "auto" }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Channel Name</TableCell>
              <TableCell>Ad Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(copyList.length > 0 ? copyList : tableData)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell>{row.adtype}</TableCell>
                  <TableCell>
                    <Button
                      //color="primary"
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
    </>
  );
};

export default AdType;
