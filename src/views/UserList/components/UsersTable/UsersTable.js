import React, { useState, forwardRef, Fragment } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Button,
  IconButton,
  TableRow,
  Typography,
  TablePagination,
  Chip,
  Tooltip,
  Link,
} from '@material-ui/core';
import InfoIcon from "@material-ui/icons/Info"
import DeleteIcon from "@material-ui/icons/Delete"
import StarIcon from "@material-ui/icons/Star"
import StarEmptyIcon from "@material-ui/icons/StarBorder"
import TableIcon from "@material-ui/icons/TableChart"
import ReserveIcon from "@material-ui/icons/Timer"
import axios from "axios";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import DeleteDialog from "../../../Dialog";
import Loading from "../../../Loading";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: 3
  },
  buttonGroup: {
    display: "flex"
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <span
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </span>
));


const UsersTable = props => {
  const { className, refresh, hideStar, is_manage, users, is_picker, paginate, setPage, onUserPick, toggleActivate, toggleStarred, userInfoClick, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showLoading, setLoadingState] = useState(false);
  const [showDeleteDialog, setDeleteDilogState] = useState(false);



  const handlePageChange = (event, page) => {
    if (setPage) {
      setPage(page + 1);
    }
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const toggleActiveState = (user) => {
    if (toggleActivate) {
      toggleActivate(user);
    }
  }

  const toggleStarState = (user) => {
    if (toggleStarred) {
      toggleStarred(user);
    }
  }

  const onUserClick = (user) => {
    if (userInfoClick) {
      userInfoClick(user);
    }
  }

  const setDelete = (user) => {
    setSelectedUser(user);
    setDeleteDilogState(true);
  }

  const onDeleteDialogCancel = () => {
    setSelectedUser({});
    setDeleteDilogState(false);
  }

  const onDeleteDialogOk = () => {
    // setCurrentReserve({});
    deleteUser();
    setDeleteDilogState(false);
  }

  const deleteUser = () => {
    setLoadingState(true);
    axios.get(`api/admin/users/${selectedUser.id}/delete`).then(res => {
      Toast(Lang.common.success, "success");
      refresh();
      // setLoadingState(false);
    }).catch(err => {

      Toast(Lang.common.connection_error, "danger");
      // setLoadingState(false);
    });
  }
  return (
    <Fragment>
      {showLoading ? (
        <Loading />
      ) : (
          <Card
            {...rest}
            className={clsx(classes.root, className)}
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
            <CardContent className={classes.content}>
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {is_picker ? (
                          <TableCell></TableCell>
                        ) : null}
                        <TableCell>{Lang.users.list.name}</TableCell>
                        <TableCell>{Lang.users.list.family}</TableCell>
                        <TableCell>{Lang.users.list.email}</TableCell>
                        {is_picker ? null : (
                          <React.Fragment>
                            <TableCell>{Lang.users.list.timezone}</TableCell>
                            <TableCell>{Lang.users.list.country}</TableCell>
                            <TableCell>{Lang.users.list.active}</TableCell>
                            {hideStar ? null : (
                              <TableCell>{Lang.users.list.starred}</TableCell>
                            )}
                            <TableCell>{Lang.users.list.birth_date}</TableCell>
                            <TableCell>{Lang.users.list.created_at}</TableCell>
                            <TableCell></TableCell>
                          </React.Fragment>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, parseInt(paginate.per_page)).map(user => (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={user.id}
                          selected={selectedUsers.indexOf(user.id) !== -1}
                        >

                          {is_picker ? (
                            <TableCell>
                              <Checkbox
                                checked={selectedUser && selectedUser.id == user.id}
                                onChange={() => {
                                  if (selectedUser && selectedUser.id == user.id) {
                                    setSelectedUser({});
                                    if (onUserPick) {
                                      onUserPick({})
                                    }
                                  } else {
                                    setSelectedUser(user);
                                    if (onUserPick) {
                                      onUserPick(user)
                                    }
                                  }
                                }}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                              />
                            </TableCell>
                          ) : null}
                          <TableCell>
                            <Link href={window.dashboard_url + "/reports/users/" + user.id}>
                              <div className={classes.nameContainer}>
                                <Avatar
                                  className={classes.avatar}
                                  src={user.avatar ? axios.defaults.baseURL + user.avatar : null}
                                >
                                  {user.name}
                                </Avatar>
                                <Typography variant="body1">{user.name}</Typography>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link href={window.dashboard_url + "/reports/users/" + user.id}>
                              {user.family}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link href={window.dashboard_url + "/reports/users/" + user.id}>
                              {user.email}
                            </Link>
                          </TableCell>
                          {is_picker ? null : (
                            <React.Fragment>

                              <TableCell>{user.timezone}</TableCell>
                              <TableCell>{user.country}</TableCell>
                              <TableCell>
                                <Chip
                                  clickable
                                  color={user.is_active == 1 ? "primary" : "secondary"}
                                  label={user.is_active == 1 ? Lang.users.activate.active : Lang.users.activate.deactive}
                                  onClick={() => toggleActiveState(user)}
                                />
                              </TableCell>
                              {hideStar ? null : (
                                <TableCell>
                                  {user.star == 1 ? (
                                    <StarIcon clickable color="primary" onClick={() => toggleStarState(user)} />
                                  ) : (
                                      <StarEmptyIcon clickable onClick={() => toggleStarState(user)} />
                                    )}
                                </TableCell>
                              )}
                              <TableCell>{user.birth_date}</TableCell>
                              <TableCell>{user.created_at_p}</TableCell>
                              <TableCell>
                                <Tooltip title={Lang.users.list.info}>
                                  <IconButton
                                    variant="contained"
                                    color="primary"
                                    component={CustomRouterLink}
                                    // onClick={() => onUserClick(user)}
                                    to={window.dashboard_url + "/reports/users/" + user.id}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                </Tooltip>
                                {is_manage ? (
                                  <Fragment>
                                    <Tooltip title={Lang.users.list.booking}>
                                      <IconButton
                                        variant="contained"
                                        color="primary"
                                        component={CustomRouterLink}
                                        // onClick={() => onUserClick(user)}
                                        to={window.dashboard_url + "/reports/users/" + user.id + "/booking"}
                                      >
                                        <ReserveIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={Lang.users.list.calendar}>
                                      <IconButton
                                        variant="contained"
                                        color="primary"
                                        component={CustomRouterLink}
                                        // onClick={() => onUserClick(user)}
                                        to={window.dashboard_url + "/reports/users/" + user.id + "/calendar"}
                                      >
                                        <TableIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Fragment>
                                ) : (
                                    <Tooltip title={Lang.common.delete}>
                                      <IconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setDelete(user)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                              </TableCell>
                            </React.Fragment>
                          )}
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
        )}
    </Fragment>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
