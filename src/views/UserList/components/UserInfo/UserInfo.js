import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  Paper
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Info, Staff, Workshops, Booking, Chat, Main } from "./components"
import Loading from "../../../Loading";
import Lang from "../../../../Language";
import axios from "axios";
import { Toast } from "../../../../config/ToastConfig/Toast.config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function ScrollableTabsButtonAuto(props) {
  const classes = useStyles();
  const [showLoading, setLoadingState] = useState(false);
  const [is_staff, setIsStaff] = useState(false);
  const [hash, setHash] = useState(window.location.hash);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    getUser();
  }, [props.match.params.user_id]);

  React.useEffect(() => {
    if (hash) {
      if (hash == "#chat") {
        setValue(3)
      }
    }
  }, [hash]);


  const getUser = () => {
    setLoadingState(true);
    axios.get(`api/admin/users/${props.match.params.user_id}/full`).then(res => {
      setLoadingState(false);
      let user = res.data.data;
      setIsStaff(!!user.roles.find(k => k.slug == "staff"));
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error, "danger");
    });
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <Paper>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Main" {...a11yProps(0)} />
              <Tab label="Info" {...a11yProps(1)} />
              {is_staff ? (
                <Tab label="workshops" {...a11yProps(2)} />
              ) : (
                <Tab label="booking" {...a11yProps(2)} />
              )}
              <Tab label="conversations" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Main />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Info />
          </TabPanel>
          {is_staff ? (
            <TabPanel value={value} index={2}>
              <Workshops />
            </TabPanel>
          ) : (
            <TabPanel value={value} index={2}>
              <Booking />
            </TabPanel>
          )}
          <TabPanel value={value} index={3}>
            <Chat />
          </TabPanel>
        </Paper>
      )}
    </div>
  );
}
