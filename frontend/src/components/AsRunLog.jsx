import React from "react";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import PropTypes from 'prop-types';
import {
    Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel
} from "@mui/material";
import {visuallyHidden} from '@mui/utils';

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

import dayjs from "dayjs";
import axios from "axios";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const EnhancedTableHead = (props) => {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
    
  };

  const columns = [
    "ID",
    "Ad Master",
    "Start Date",
    "Start Time",
    "End Date",
    "End Time",
  ];

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : "asc"}
              onClick={createSortHandler(headCell)}
            >
              {headCell}
              {orderBy === headCell ? (
                <Box component="span" sx={visuallyHidden} >
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const AsRunLog = () => {
  const [tableData, setTableData] = React.useState([]);
  const [copyList, setCopyList] = useState(tableData);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(tableData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

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
            {/* <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ad Master</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>End Time</TableCell>
              </TableRow>
            </TableHead> */}
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
            />
            <TableBody>
              {
              //(copyList.length > 0 ? copyList : tableData)
                visibleRows
                //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
