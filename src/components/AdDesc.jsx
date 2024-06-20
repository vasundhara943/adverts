import React, { Fragment } from "react";
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import AdType from "../components/AdType";
// import Schedule from "../components/Schedule";
// import AdMaster from "../components/AdMaster";
import { Link } from "react-router-dom";

const AdDesc = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="p-6">
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Ad Type" component={Link} to="/adtype"/>
            <Tab label="Ad Master" component={Link} to="/admaster"/>
            <Tab label="Scheduling" component={Link} to="/schedule"/>
          </Tabs>
          {/* {value === 0 && (
            <AdType/>
          )}
          {value === 1 && (
            <AdMaster/>
          )}
          {value === 2 && (
            <Schedule/>
          )} */}
        </Box>
      </div>
    </>
  );
};

export default AdDesc;
