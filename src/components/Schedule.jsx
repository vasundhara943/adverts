import * as React from "react";

import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import { Switch } from "@mui/material";

import DatePickerValue from "./DatePicker";
import TimePickerValue from "./TimePicker";
import SelectField from "./SelectField";
import CreateTable from "./CreateTable";

export default function Schedule() {
  const [adtype, setAdtype] = React.useState("");

  const handleChange = (event) => {
    setAdtype(event.target.value);
  };

  const values = ["Lband", "Aston", "Bug"];

  return (
    <>
    <div className="pt-10 flex justify-center items-center">
      <div className="grid grid-cols-3 grid-rows-2 gap-10 items-center">
        
          <div >
            <InputLabel id="adtype">Ad Type</InputLabel>
            <SelectField sx={{width: '500px'}} labelId="adtype" name= "adtype" values={values} />
          </div>
          <div>
            <InputLabel id="startdate">Start Date</InputLabel>
            <DatePickerValue labelId="startdate" />
          </div>
          <div>
            <InputLabel id="starttime">Start Time</InputLabel>
            <TimePickerValue labelId="starttime" />
          </div>
        {/* </div>
        <div className="pt-10 flex justify-center items-center space-x-10"> */}
          <div>
            <InputLabel id="active">Active?</InputLabel>
            <Switch labelId="active" defaultChecked />
          </div>
          <div>
            <InputLabel id="enddate">End Date</InputLabel>
            <DatePickerValue labelId="enddate" />
          </div>
          <div>
            <InputLabel id="endtime">End Time</InputLabel>
            <TimePickerValue labelId="endtime" />
          </div>
        </div>
      </div>
      <div className="pt-20 flex justify-center items-center lg:w-3/4"><CreateTable/></div>
    </>
  );
}
