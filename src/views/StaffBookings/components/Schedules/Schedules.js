import React , { useState , forwardRef } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Chip
} from '@material-ui/core';
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import store from "store";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    marginTop: theme.spacing(1)
  },
  inner: {
      
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  section: {
    padding: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));



const Schedules = props => {
    const { className , schedules , refresh , setPage , paginate, ...rest } = props;

    const classes = useStyles();

    //   const [selectedUsers, setSelectedUsers] = useState([]);
    //   const [selectedUser, setSelectedUser] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [schedule_list,setScheduleList] = useState(schedules);


  const handlePageChange = (event, page) => {
    if(setPage){
      setPage(page + 1);
    }
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };
  

  const getTime = (date , timezone , format = "Y-M-D H:mm") => {
    if(timezone){
      return moment.utc(date).tz(timezone ).format(format);
    }
    return moment(date).format(format);
  }

  const togglePresentState = (schedule) => {
    let data = {
      user_id : schedule.reserve.user_id,
      schedule_id : schedule.id
    }
    axios.post(`api/staff/schedules/${schedule.reserve.id}/toggle_present` , data).then(res => {
      refresh();
      Toast(Lang.common.success , "success");
      // setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      // setLoadingState(false);
    });
  }

  const toggleHoldState = (schedule) => {
    let data = {
      user_id : schedule.reserve.user_id,
      schedule_id : schedule.id
    }
    axios.post(`api/staff/schedules/${schedule.reserve.id}/toggle_hold` , data).then(res => {
      refresh();
      Toast(Lang.common.success , "success");
      // setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      // setLoadingState(false);
    });
  }

  const toggleNeedRescheduleState = (schedule) => {
    let data = {
      user_id : schedule.reserve.user_id,
      schedule_id : schedule.id
    }
    axios.post(`api/staff/schedules/${schedule.reserve.id}/toggle_reschedule` , data).then(res => {
      refresh();
      Toast(Lang.common.success , "success");
      // setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      // setLoadingState(false);
    });
  }


  return (
    <Card
      {...rest}
      className={clsx(classes.root, classes.section , classes.content)}
    >
      <CardContent className={classes.content}>
          <Typography component="h5" variant="h5" className={classes.section}>
                {Lang.staff_booking.reserve.schedules.title}
          </Typography>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                    <TableCell>{Lang.staff_booking.reserve.schedules.list.start}</TableCell>
                    <TableCell>{Lang.staff_booking.reserve.schedules.list.time}</TableCell>
                    <TableCell>{Lang.my_packages.package.schedules.list.present_state}</TableCell>
                    <TableCell>{Lang.staff_booking.reserve.schedules.list.hold}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule_list.slice(0, parseInt(paginate.per_page)).map(schedule => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={schedule.id}
                  >
                    <TableCell>{getTime(schedule.date , store.get("user").timezone , "Y-M-D")}</TableCell>
                    <TableCell>{getTime(schedule.date , store.get("user").timezone , "H:mm")}</TableCell>
                    <TableCell>
                        {(schedule.user_present == 1) ? (
                          <Chip 
                          label={Lang.my_packages.package.schedules.list.present} 
                          color="primary"
                          onClick={() => togglePresentState(schedule)}
                          />
                        ) : (
                          <Chip 
                          label={Lang.my_packages.package.schedules.list.absent} 
                          color="secondary"
                          onClick={() => togglePresentState(schedule)}
                          />
                        )}
                    </TableCell>
                    <TableCell>
                        {(schedule.hold == 1) ? (
                          <Chip 
                          label={Lang.staff_booking.reserve.schedules.list.hold_state.hold} 
                          color="primary"
                          onClick={() => toggleHoldState(schedule)}
                          />
                        ) : (
                          <Chip 
                          label={Lang.staff_booking.reserve.schedules.list.hold_state.not_hold} 
                          color="secondary"
                          onClick={() => toggleHoldState(schedule)}
                          />
                        )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={schedule.need_reschedule == 1 ? Lang.staff_booking.reserve.schedules.list.reschedule_requested : Lang.staff_booking.reserve.schedules.list.need_reschedule }
                        color="primary"
                        onClick={() => toggleNeedRescheduleState(schedule)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={paginate.total}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={paginate.current_page - 1}
          rowsPerPage={parseInt(paginate.per_page)}
          rowsPerPageOptions={[parseInt(paginate.per_page)]}
        />
      </CardActions>
    </Card>
  );
};


export default Schedules;
