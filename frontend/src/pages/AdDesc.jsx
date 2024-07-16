import React, { Fragment } from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AdType from "../components/AdType";
import Schedule from "../components/Schedule";
import AdMaster from "../components/AdMaster";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import LogoImg from "../images/logo.png";

// import LogoImg from "../images/ndtv_logo_2.png";
import { styled } from "styled-components";

const AdDesc = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  const NavLogo = styled(Link)`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 6px;
    font-weight: 500;
    font-size: 18px;
    text-decoration: none;
    color: inherit;
  `;
  const Logo = styled.img`
    height: 34px;
  `;

  return (
    <>
      <Box  >
        <AppBar position="static" sx={{ bgcolor: "#a10000" }}>
          <Toolbar>
            <NavLogo to="/describe_ad">
              <Logo src={LogoImg} />
            </NavLogo>
            <Box sx={{ width: "100%", bgcolor: "inherit", marginLeft: -190}}>
              <Tabs tabvalue={tabValue} onChange={handleChange} centered textColor='white'>
                <Tab label="Ad Type" />
                <Tab label="Ad Master" />
                <Tab label="Scheduling" />
              </Tabs>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        {tabValue === 0 && <AdType />}
        {tabValue === 1 && <AdMaster />}
        {tabValue === 2 && <Schedule />}
      </div>
    </>
  );
};

export default AdDesc;
