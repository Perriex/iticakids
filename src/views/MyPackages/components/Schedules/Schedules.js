import React, { useState, forwardRef, Fragment } from 'react';
import clsx from 'clsx';
import moment from 'moment-timezone';
import { NavLink as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Button,
  TableRow,
  Typography,
  Chip
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import DeleteIcon from "@material-ui/icons/Delete"
import Lang from "../../../../Language";
import axios from "axios";
import store from "store";
import DeleteDialog from "../../../Dialog";
import Loading from "../../../Loading";
import Dialog from "../../../Dialog";

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
  const { className, schedules, mPackage, refresh, onReschedule, ...rest } = props;

  const classes = useStyles();

  //   const [selectedUsers, setSelectedUsers] = useState([]);
  const [current_schedule, setCurrentSchedule] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [schedule_list, setScheduleList] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [showLoading, setLoadingState] = useState(false);
  const [showRescheduleDialog, setRescheduleDialogState] = useState(false);
  const [showDeleteDialog, setDeleteDilogState] = useState(false);
  const [isMyPackages, setIsMyPackages] = useState(Boolean(props.match.path.includes("mypackages")));
  React.useEffect(() => {
    setScheduleList(schedules);
  }, [schedules])


  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const getTime = (date, timezone) => {
    if (timezone) {
      return moment.utc(date).tz(timezone).format("Y-M-D H:mm");
    }
    return moment(date).format("Y-M-D H:mm");
  }

  const canUserManage = () => {
    let permission = store.get("user").permissions.find(k => k.slug == "user-manage");
    return !!permission;
  }

  const getTitles = () => {
    return (
      <Fragment>
        {isMyPackages ? null : (
          <TableCell></TableCell>
        )}
        <TableCell>{Lang.my_packages.list.dur}</TableCell>
        <TableCell>{Lang.my_packages.list.schedule}</TableCell>
        {isMyPackages ? (
          <TableCell>{Lang.my_packages.package.schedules.list.start_student}</TableCell>
        ) : (
          <Fragment>
            <TableCell>{Lang.my_packages.package.schedules.list.start_student}</TableCell>
            <TableCell>{Lang.my_packages.package.schedules.list.start_staff}</TableCell>
            <TableCell>{Lang.my_packages.package.schedules.list.present_state}</TableCell>
          </Fragment>
        )}
        <TableCell>{Lang.my_packages.package.schedules.list.hold_for_user}</TableCell>
        <TableCell>{Lang.my_packages.package.schedules.list.hold}</TableCell>
        <TableCell>{Lang.my_packages.package.schedules.list.reschedule}</TableCell>
      </Fragment>
    )
  }


  const onDeleteDialogCancel = () => {
    setCurrentSchedule({});
    setDeleteDilogState(false);
  }

  const onDeleteDialogOk = () => {
    // setCurrentReserve({});
    deleteSchedule();
    setDeleteDilogState(false);
  }


  const setDelete = (schedule) => {
    setCurrentSchedule(schedule);
    setDeleteDilogState(true);
  }

  const deleteSchedule = () => {
    setLoadingState(true);
    let data = {
      user_id: mPackage.user_id,
      schedule_id: current_schedule.id
    }
    axios.post(`api/admin/users/packages/${mPackage.id}/delete_schedule`, data).then(res => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    }).catch(err => {
      refresh();
      // window.location.reload(false);
      // setLoadingState(false);
    });
  }

  const togglePresentState = (schedule) => {
    setLoadingState(true);
    let data = {
      user_id: mPackage.user_id,
      schedule_id: schedule.id
    }
    axios.post(`api/admin/users/packages/${mPackage.id}/toggle_present`, data).then(res => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    }).catch(err => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    });
  }

  const toggleHoldState = (schedule) => {
    setLoadingState(true);
    let data = {
      user_id: mPackage.user_id,
      schedule_id: schedule.id
    }
    axios.post(`api/admin/users/packages/${mPackage.id}/toggle_hold`, data).then(res => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    }).catch(err => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    });
  }

  const toggleUserHoldState = (schedule) => {
    if (!canUserManage()) {
      return;
    }
    setLoadingState(true);
    let data = {
      user_id: mPackage.user_id,
      schedule_id: schedule.id
    }
    axios.post(`api/admin/users/packages/${mPackage.id}/toggle_user_hold`, data).then(res => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    }).catch(err => {
      // window.location.reload(false);
      refresh();
      // setLoadingState(false);
    });
  }

  const checkCanReschedule = (session) => {
    if (mPackage.type == 'biweekly') {
      return false;
    } else {
      let info = JSON.parse(mPackage.reschedule_info);
      let current = moment(session.date).format("X");
      let now = moment().format("X");
      let can_reschedule = current >= now;
      can_reschedule = can_reschedule && !!info.find(k => moment(k.start).format('X') <= current && moment(k.end).format('X') >= current && !k.rescheduled);
      can_reschedule = can_reschedule || session.need_reschedule == 1;
      return can_reschedule;
    }
  }

  const rescheduleSession = () => {
    setRescheduleDialogState(false)
    if (onReschedule) {
      onReschedule(schedule)
    }
  }

  return (
    <Fragment>
      {showLoading ? (
        <Loading />
      ) : (
        <Card
          {...rest}
          className={clsx(classes.root, classes.section, classes.content)}
        >
          <DeleteDialog
            msg={Lang.common.delete_msg}
            title={Lang.common.warning}
            negative_btn={Lang.common.cancel}
            on_negative_btn={onDeleteDialogCancel}
            positive_btn={Lang.common.delete}
            on_positive_btn={onDeleteDialogOk}
            open_dialog={showDeleteDialog}
          />
          <Dialog
            open_dialog={showRescheduleDialog}
            msg={Lang.my_packages.package.schedules.reschedule_msg}
            title={Lang.common.warning}
            negative_btn={Lang.common.cancel}
            positive_btn={Lang.common.ok}
            on_negative_btn={() => setRescheduleDialogState(false)}
            on_positive_btn={rescheduleSession}
          />
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5" className={classes.section}>
              {Lang.my_packages.package.schedules.title}
            </Typography>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {getTitles()}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule_list.map((schedule, i) => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={schedule.id}
                      >

                        {isMyPackages ? null : (
                          <TableCell>
                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteIcon />}
                              onClick={() => { setDelete(schedule) }}
                            >
                              {Lang.common.delete}
                            </Button>
                          </TableCell>
                        )}
                        <TableCell style={{ direction: Lang.direction }}>
                          {mPackage.staff_package.duration} {Lang.my_packages.package.schedules.list.minutes}
                        </TableCell>
                        <TableCell style={{ direction: Lang.direction }}>
                          {i + 1} {Lang.my_packages.package.schedules.list.from} {schedule_list.length}
                        </TableCell>
                        <TableCell>{getTime(schedule.date, mPackage.timezone)}</TableCell>
                        {isMyPackages ? (
                          <Fragment>
                            <TableCell>
                              {schedule.user_hold == 1 ? (
                                <Chip label={Lang.my_packages.package.schedules.true} color="primary" />
                              ) : (
                                <Chip label={Lang.my_packages.package.schedules.false} color="secondary" />
                              )}
                            </TableCell>
                            <TableCell>
                              {schedule.hold == 1 ? (
                                <Chip label={Lang.my_packages.package.schedules.list.hold_state.hold} color="primary" />
                              ) : (
                                <Chip label={Lang.my_packages.package.schedules.list.hold_state.not_hold} color="secondary" />
                              )}
                            </TableCell>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <TableCell>{getTime(schedule.date, mPackage.staff_package.staff.user.timezone)}</TableCell>
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
                              {schedule.user_hold == 1 ? (
                                <Chip label={Lang.my_packages.package.schedules.true}
                                  onClick={() => toggleUserHoldState(schedule)}
                                  color="primary" />
                              ) : (
                                <Chip label={Lang.my_packages.package.schedules.false}
                                  onClick={() => toggleUserHoldState(schedule)}
                                  color="secondary" />
                              )}
                            </TableCell>
                            <TableCell>
                              {(schedule.hold == 1) ? (
                                <Chip
                                  label={Lang.my_packages.package.schedules.list.hold_state.hold}
                                  color="primary"
                                  onClick={() => toggleHoldState(schedule)}
                                />
                              ) : (
                                <Chip
                                  label={Lang.my_packages.package.schedules.list.hold_state.not_hold}
                                  color="secondary"
                                  onClick={() => toggleHoldState(schedule)}
                                />
                              )}
                            </TableCell>
                          </Fragment>
                        )}
                        <TableCell>
                          <Chip
                            label={Lang.my_packages.package.schedules.reschedule}
                            color="primary"
                            disabled={!checkCanReschedule(schedule)}
                            onClick={
                              () => {
                                if (checkCanReschedule(schedule)) {
                                  setRescheduleDialogState(true);
                                  setSchedule(schedule);
                                }
                              }
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          </CardContent>
        </Card>
      )}
    </Fragment>

  );
};


export default withRouter(Schedules);
