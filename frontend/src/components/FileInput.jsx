import React from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import axios from "axios";
import { InputLabel, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

function FileInput() {
  var today = new Date();
  const [fileDate, setFileDate] = React.useState(dayjs(today));

  var [tabData, setTabData] = React.useState([]);
  const [masterData, setMasterData] = React.useState([]);
  const [masterList, setMasterList] = React.useState([]);
  const [tapeList, setTapeList] = React.useState([]);

  // const [endTime, setEndTime] = React.useState(-1);
  var freqMap = {};

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admaster/getactive"
        );
        //console.log("Response:", response1.data);
        if (Array.isArray(response.data.data)) {
          // setMasterData(response.data.data);
          // //console.log("Master data:", response1.data.data);
          setMasterData(response.data);
          console.log("MasterData: ", masterData);
          setTapeList(response.data.data.map((row) => row.tapeID));
          setMasterList(
            response.data.data.map(
              (row) => `${row.channel}_${row.name}_${row.adtype}`
            )
          );
          console.log("Tape List: ", tapeList);
          console.log("Master List: ", masterList);
          //setMasterTapeList(Object.fromEntries(masterData.map(row => [row.tapeID, `${row.channel}_${row.name}_${row.adtype}`])))
          //setMasterTapeList(Object.assign({}, ...masterData.map((row) => ({[row.tapeID]: `${row.channel}_${row.name}_${row.adtype}`}))));
          //console.log("Master: ", masterTapeList);
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
      console.log(parsedData);
      // console.log(data);
      setTabData([]);
      console.log("Tab Data: ", tabData);

      let currTime = -1;
      let endTime = -1;
      for (let i = 0; i < parsedData.length; i++) {
        const element = parsedData[i];
        await axios.post(`http://localhost:8000/schedule/savefile`, {
          fileDate: fileDate ? dayjs(fileDate).format("YYYY-MM-DD") : null,
          telecastTime: element["Telecast Time"]
            ? element["Telecast Time"]
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
          isRun: element["Is Run"] ? element["Is Run"] : null,
        });

        if (!isNaN(element["Telecast Time"])) {
          currTime = element["Telecast Time"] * 24;
          console.log("Curr Time: ", currTime);
          if (currTime === endTime) {
            console.log("Freq Map: ", freqMap);
            for (let key in freqMap) {
              console.log("Key: ", key, " ", freqMap[key]);
              if (tabData === null) {
                setTabData({
                  tapeID: key,
                  adMaster: masterList[tapeList.indexOf(key)]
                    ? masterList[tapeList.indexOf(key)]
                    : "master",
                  //: masterData[masterData['tapeID'].indexOf(key)].channel,
                  startDate: fileDate ? dayjs(fileDate).format("YYYY-MM-DD") : null,
                  startTime:
                    endTime <= 10
                      ? `0${endTime - 1}:00:00`
                      : `${endTime - 1}:00:00`,
                  endDate: fileDate ? dayjs(fileDate).format("YYYY-MM-DD") : null,
                  endTime:
                    endTime < 10 ? `0${endTime}:00:00` : `${endTime}:00:00`,
                  frequency: freqMap[key],
                });
              } else {
                // setTabData((tabData) => [...tabData, {
                tabData.push({
                  tapeID: key,
                  adMaster: masterList[tapeList.indexOf(key)]
                    ? masterList[tapeList.indexOf(key)]
                    : "master",
                  //: masterData[masterData['tapeID'].indexOf(key)].channel,
                  startDate: fileDate ? dayjs(fileDate).format("YYYY-MM-DD") : null,
                  startTime:
                    endTime <= 10
                      ? `0${endTime - 1}:00:00`
                      : `${endTime - 1}:00:00`,
                  endDate: fileDate ? dayjs(fileDate).format("YYYY-MM-DD") : null,
                  endTime:
                    endTime < 10 ? `0${endTime}:00:00` : `${endTime}:00:00`,
                  frequency: freqMap[key],
                });
              }
            }
            console.log("Table Data: ", tabData);
            freqMap = {};
            endTime = currTime + 1;
            console.log("End Time: ", endTime);
          } else if (currTime % 1 === 0) {
            endTime = currTime + 1;
            console.log("End Time: ", endTime);
          }
        } else if (element["Type"] != "OTHERS SECONDARY") {
          //console.log("Prog Time: ", (element["Telecast Time"]));
          // if(element[""])
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
      console.log("Tab Data: ", tabData);
    };
  };

  return (
    <div className="pt-10 justify-center grid gap-7 2xl:gap-10 items-center grid-cols-5">
      <div className="font-bold text-xl">
        <h2>File Upload:</h2>
      </div>
      <div className="col-span-2">
        <InputLabel>Upload Scheduling File</InputLabel>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>
      <div className="col-span-2">
        <InputLabel id="filedate">Date</InputLabel>
        <DatePicker
          sx={{ width: "200px" }}
          value={fileDate}
          onChange={(date) => setFileDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </div>
  );
}

export default FileInput;
