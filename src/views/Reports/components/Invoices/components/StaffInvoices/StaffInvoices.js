import React , { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InvoicesTable from "../InvoicesTable"
import axios from "axios";
import Loading from "../../../../../Loading";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
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
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ScrollableTabsButtonForce() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [ showLoading , setLoadingState ] = useState(false);
    const [ rows , setRows ] = useState([]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        getInvoices("packages");
    } , [])

    const getInvoices = (type) => {
        setLoadingState(true);
        let data = {
            type : type,
        }
        axios.post(`api/staff/invoices` , data).then(res => {
            setLoadingState(false);
            setRows(res.data.invoices)
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        })
    }

    return (
        <div className={classes.root}>
        <AppBar position="static" color="default">
            <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
            >
            <Tab label={Lang.reports.type.packages} {...a11yProps(0)} onClick={() => getInvoices("packages")}/>
            <Tab label={Lang.reports.type.workshops} {...a11yProps(1)} onClick={() => getInvoices("workshops")} />
            </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
            {showLoading ? (
                <Loading />
            ) : (
                <InvoicesTable rows={rows} isStaff={true} type={"packages"}/>
            )}
        </TabPanel>
        <TabPanel value={value} index={1}>
            {showLoading ? (
                <Loading />
            ) : (
                <InvoicesTable rows={rows} isStaff={true} type={"workshops"}/>
            )}
        </TabPanel>
        </div>
    );
}
