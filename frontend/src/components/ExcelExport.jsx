import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ExcelExport = ({ data, columnMapping, fileName }) => {
  const exportToExcel = () => {

    const filteredData = data.map((row) => {
      const filteredRow = {};
      Object.keys(columnMapping).forEach((originalCol) => {
        filteredRow[columnMapping[originalCol]] = row[originalCol];
      });
      return filteredRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: "#a10000",
        }}
        onClick={exportToExcel}
      >
        Export to Excel
      </Button>
    </LocalizationProvider>
  );
};

export default ExcelExport;
