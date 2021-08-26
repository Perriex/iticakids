import React, { useState  , Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { 
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Collapse,
    Box,
    Typography,
    Paper,
    Chip,
 } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AddIcon from '@material-ui/icons/Add';
import UserStaffDetails from '../../../../components/UserStaffDetails';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import Loading from "../../../../../Loading";
import moment from "moment";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  marginTop: {
    marginTop: theme.spacing(1)
  }
}));

const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
  
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.title}
          </TableCell>
          <TableCell align="right">{row.capacity}</TableCell>
          <TableCell align="right">{row.start_at}</TableCell>
          <TableCell align="right">{row.created_at}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Sessions
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>{Lang.workshop.list.start_at}</TableCell>
                      <TableCell>{Lang.reports.reserves.sessions.hold}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.sessions.map((session , i) => (
                      <TableRow key={i}>
                        <TableCell>{session.start_date}</TableCell>
                        <TableCell>
                            {moment().format("X") <= moment(session.start_date).format('X') ? (
                                <Chip  label="N" color="secondary"/>
                            ) : (
                                <Chip  label="Y" color="primary"/>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  

const Workshops = props => {

    const classes = useStyles();
    const [showLoading, setLoadingState] = useState(true);
    const [ rows , setRows ] = useState([]);

    React.useEffect(() => {
        getWorkshops();
    } , []);

    const getWorkshops = () => {
        setLoadingState(true);
        axios.get(`api/admin/staffs/${props.match.params.user_id}/workshops`).then(res => {
            setLoadingState(false);
            setRows(res.data.data);
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger")
        })
    }

    return (
        <div>
        {showLoading ? (
            <Loading />
        ) : (
            <div>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{Lang.workshop.list.title}</TableCell>
                            <TableCell align="right">{Lang.workshop.list.capacity}</TableCell>
                            <TableCell align="right">{Lang.workshop.list.start_at}</TableCell>
                            <TableCell align="right">{Lang.workshop.list.created_at}</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )}
        </div>
    );
};


export default withRouter(Workshops);
