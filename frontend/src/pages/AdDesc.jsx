import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AdType from "../components/AdType";
import Schedule from "../components/Schedule";
import AdMaster from "../components/AdMaster";
import AsRunLog from "../components/AsRunLog";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import LogoImg from "../images/logo.png";

import { styled } from "styled-components";

import axios from "axios";

const AdDesc = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newTabValue) => {
    setTabValue(newTabValue);
    console.log("New tab: ", newTabValue);
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        axios
          .get("http://localhost:8000/checkauth", {
            headers: {
              "access-token": sessionStorage.getItem("token"),
            },
          })
          .then((res) => {
            //console.log(res);
            if (res.data.Login == false) {
              navigate("/login");
            }
          });
      } catch (error) {
        console.error("Error:", error);
        navigate("/login");
      }
    };
    handleAuth();
  }, []);

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
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#a10000" }}>
          <Toolbar className="grid grid-cols-3 items-start">
            {/* <NavLogo to="/"> */}
            <div>
              <Logo src={LogoImg} />
            </div>
            {/* </NavLogo> */}
            {/* <Box > */}
            {/* // , marginLeft: -190}}> */}
            <Tabs
              tabvalue={tabValue}
              onChange={handleChange}
              centered
              textColor="white"
              sx={{ width: "100%", bgcolor: "inherit" }}
            >
              <Tab label="Ad Type" />
              <Tab label="Ad Master" />
              <Tab label="Scheduling" />
              <Tab label="As Run Log" />
            </Tabs>
            {/* </Box> */}
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        {tabValue === 0 && <AdType />}
        {tabValue === 1 && <AdMaster />}
        {tabValue === 2 && <Schedule />}
        {tabValue === 3 && <AsRunLog />}
      </div>
    </>
  );
};

export default AdDesc;
