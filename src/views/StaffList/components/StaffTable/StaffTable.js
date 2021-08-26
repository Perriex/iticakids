import React, { useState , forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
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
} from '@material-ui/core';
import InfoIcon from "@material-ui/icons/Info"
import DeleteIcon from "@material-ui/icons/Delete"
import StaffDeleteDialog from "../StaffDeleteDialog";
import axios from 'axios';
import Lang from "../../../../Language";


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <span
    ref={ref}
  >
    <RouterLink {...props} />
  </span>
));


const StaffTable = props => {
  const { className, users , is_picker , onStaffPick  , setPage, paginate, toggleActivate , onStaffDelete , userInfoClick, ...rest } = props;

  console.log('props',props)
  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openDeleteDialog , setDeleteDialogState] = useState(false);
  const [current_staff , setCurrentStaff] = useState(null);

  const handleSelectAll = event => {

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };


  const handlePageChange = (event, page) => {
    if(setPage){
      setPage(page + 1);
    }
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const toggleActiveState = (user) => {
    if(toggleActivate){
      toggleActivate(user);
    }
  }

  const onUserClick = (user)  => {
    if(userInfoClick){
      userInfoClick(user);
    }
  }

  const deleteStaff = (staff) => {
    setCurrentStaff(staff);
    setDeleteDialogState(true);
  }

  const onDeleteDialogClose = (can_delete)=>{
    if(can_delete){
      onStaffDelete(current_staff.staff.slug);
    }
    setDeleteDialogState(false);
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <StaffDeleteDialog openDialog={openDeleteDialog} onDialogClosed={onDeleteDialogClose} current_staff={current_staff}/>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {is_picker ? (
                    <TableCell></TableCell>
                  ) : null}
                  <TableCell>{Lang.staffs.list.name}</TableCell>
                  <TableCell>{Lang.staffs.list.family}</TableCell>
                  <TableCell>{Lang.staffs.list.email}</TableCell>
                  {is_picker ? null : (
                    <React.Fragment>
                      <TableCell>{Lang.staffs.list.created_at}</TableCell>
                      <TableCell></TableCell>
                    </React.Fragment>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, parseInt(10)).map(user => (
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
                          onChange={()=> {
                            if(selectedUser && selectedUser.id == user.id){
                              setSelectedUser({});
                              if(onStaffPick){
                                onStaffPick({})
                              }
                            }else{
                              setSelectedUser(user);
                              if(onStaffPick){
                                onStaffPick(user)
                              }
                            }
                          }}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar
                          className={classes.avatar}
                          src={user.avatar ? axios.defaults.baseURL + user.avatar : null}
                        >
                          {user.name}
                        </Avatar>
                        <Typography variant="body1">{user.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.family}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    {is_picker ? null : (
                    <React.Fragment>
                      <TableCell>{user.created_at_p}</TableCell>
                      <TableCell className={classes.nameContainer}>
                        <Tooltip title={Lang.staffs.list.info}>
                          <IconButton
                              color="primary"
                              component={CustomRouterLink}
                              // onClick={() => onUserClick(user)}
                              to={window.dashboard_url + "/staffs/"+user.staff.slug}
                            >
                              <InfoIcon/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={Lang.common.delete}>
                          <IconButton
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              onClick={() => deleteStaff(user)}
                            >
                              <DeleteIcon/>
                          </IconButton>
                        </Tooltip>
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
  );
};

StaffTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default StaffTable;
