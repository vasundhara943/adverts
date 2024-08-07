import React from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import axios from "axios";
import { InputLabel, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function FileInput() {
  var today = new Date();
  const [fileDate, setFileDate] = React.useState(dayjs(today));

  var [tabData, setTabData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [masterList, setMasterList] = React.useState([]);
  const [tapeList, setTapeList] = React.useState([]);

  var freqMap = {};

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admaster/getactive"
        );
        if (Array.isArray(response.data.data)) {
          setMasterData(response.data);
          setTapeList(response.data.data.map((row) => row.tapeID));
          setMasterList(
            response.data.data.map(
              (row) => `${row.channel}_${row.name}_${row.adtype}`
            )
          );
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    const importRange = "A3:K1000";
    const headers = [
      "Telecast Time",
      "Timeband Name",
      "Requested Timeband Name",
      "Type",
      "Tape ID",
      "Event",
      "Client Name",
      "Duration",
      "Content Type",
      "Product Name",
      "Booked Program",
    ];
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        range: importRange,
        header: headers,
      });
      setTabData([]);

      let currTime = -1;
      let endTime = -1;
      await axios.delete(
        `http://localhost:8000/schedule/deletefile/${dayjs(fileDate).format(
          "YYYY-MM-DD"
        )}`
      );
      for (let i = 0; i < parsedData.length; i++) {
        const element = parsedData[i];
        await axios.post(`http://localhost:8000/schedule/savefile`, {
          id: i + 1,
          fileDate: fileDate
            ? dayjs(fileDate).tz("Asia/Kolkata").format("YYYY-MM-DD")
            : null,
          telecastTime: element["Telecast Time"]
            ? isNaN(element["Telecast Time"])
              ? element["Telecast Time"]
              : element["Telecast Time"] * 24 < 10
              ? (element["Telecast Time"] * 24) % 1 != 0
                ? `0${parseInt(element["Telecast Time"] * 24)}:30:00`
                : `0${element["Telecast Time"] * 24}:00:00`
              : (element["Telecast Time"] * 24) % 1 != 0
              ? `${parseInt(element["Telecast Time"] * 24)}:30:00`
              : `${element["Telecast Time"] * 24}:00:00`
            : null,
          timebandName: element["Timeband Name"]
            ? element["Timeband Name"]
            : null,
          requestedTimebandName: element["Requested Timeband Name"]
            ? element["Requested Timeband Name"]
            : null,
          adType: element["Type"] ? element["Type"] : null,
          tapeID: element["Tape ID"] ? element["Tape ID"] : null,
          eventName: element["Event"] ? element["Event"] : null,
          clientName: element["Client Name"] ? element["Client Name"] : null,
          duration: element["Duration"] ? element["Duration"] : null,
          contentType: element["Content Type"] ? element["Content Type"] : null,
          productName: element["Product Name"] ? element["Product Name"] : null,
          bookedProgram: element["Booked Program"]
            ? element["Booked Program"]
            : null,
        });

        if (!isNaN(element["Telecast Time"])) {
          currTime = element["Telecast Time"] * 24;
          if (currTime === endTime) {
            for (let key in freqMap) {
              if (tabData === null) {
                setTabData({
                  tapeID: key,
                  adMaster: masterList[tapeList.indexOf(key)]
                    ? masterList[tapeList.indexOf(key)]
                    : "master",
                  startDate: fileDate
                    ? dayjs(fileDate).format("YYYY-MM-DD")
                    : null,
                  startTime:
                    endTime <= 10
                      ? `0${endTime - 1}:00:00`
                      : `${endTime - 1}:00:00`,
                  endDate: fileDate
                    ? dayjs(fileDate).format("YYYY-MM-DD")
                    : null,
                  endTime:
                    endTime < 10 ? `0${endTime}:00:00` : `${endTime}:00:00`,
                  frequency: freqMap[key],
                });
              } else {
                tabData.push({
                  tapeID: key,
                  adMaster: masterList[tapeList.indexOf(key)]
                    ? masterList[tapeList.indexOf(key)]
                    : "AdMaster not defined",
                  startDate: fileDate
                    ? dayjs(fileDate).format("YYYY-MM-DD")
                    : null,
                  startTime:
                    endTime <= 10
                      ? `0${endTime - 1}:00:00`
                      : `${endTime - 1}:00:00`,
                  endDate: fileDate
                    ? dayjs(fileDate).format("YYYY-MM-DD")
                    : null,
                  endTime:
                    endTime < 10 ? `0${endTime}:00:00` : `${endTime}:00:00`,
                  frequency: freqMap[key],
                });
              }
            }
            freqMap = {};
            endTime = currTime + 1;
          } else if (currTime % 1 === 0) {
            endTime = currTime + 1;
          }
        } else if (element["Type"] != "OTHERS SECONDARY") {
          if (freqMap[element["Tape ID"]] === undefined) {
            freqMap[element["Tape ID"]] = 1;
          } else {
            freqMap[element["Tape ID"]] += 1;
          }
        }
      }
      for (let i = 0; i < tabData.length; i++) {
        let element = tabData[i];
        await axios.post(`http://localhost:8000/schedule/add`, {
          tapeID: element.tapeID,
          adMaster: element.adMaster,
          startDate: element.startDate,
          startTime: element.startTime,
          endDate: element.endDate,
          endTime: element.endTime,
          frequency: element.frequency,
        });
      }
      tabData = [];
    };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <div className="pt-10 justify-center mx-20 grid gap-7 2xl:gap-10 items-center grid-cols-5">
        <div className="font-bold text-xl">
          <h2>File Upload:</h2>
        </div>
        <div className="col-span-">
          <InputLabel id="filedate">Date</InputLabel>
          <DatePicker
            sx={{ width: "200px" }}
            value={fileDate}
            onChange={(date) => setFileDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div className="col-span-">
          <InputLabel>Upload Scheduling File</InputLabel>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </div>
        <div className="col-span-2"></div>
      </div>
    </LocalizationProvider>
  );
}

export default FileInput;
