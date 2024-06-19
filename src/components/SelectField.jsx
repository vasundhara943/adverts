import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectField({ name, values }) {
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{width: '200px'}}>
        <Select
          labelId={name}
          //   id="demo-simple-select"
          value={value}
          label={name}
          onChange={handleChange}
        >
            {Object.keys(values).map((item, pos) => {
              return (
                <MenuItem key={pos} value={item}>
                  {values[item]}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </Box>
  );
}
