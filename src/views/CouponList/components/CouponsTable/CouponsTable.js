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
  Chip
} from '@material-ui/core';
import InfoIcon from "@material-ui/icons/Info"
import DeleteIcon from "@material-ui/icons/Delete"
import uuid from 'uuid/v1';
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
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  flex:{
    display : "flex"
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


const UsersTable = props => {
  const { className, coupons , onDeleteDialog ,setPage , paginate , couponInfoClick, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = event => {

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = coupons.map(user => user.id);
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

  const onDeleteClick = (user) => {
    if(onDeleteDialog){
      onDeleteDialog(user);
    }
  }

  const onUserClick = (user)  => {
    if(couponInfoClick){
      couponInfoClick(user);
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Lang.coupon.list.code}</TableCell>
                  <TableCell>{Lang.coupon.list.percent}</TableCell>
                  <TableCell>{Lang.coupon.list.usage}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.slice(0, parseInt(paginate.per_page)).map(coupon => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={uuid()}
                  >
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.percentage} %</TableCell>
                    <TableCell>{coupon.usage}</TableCell>
                    <TableCell className={classes.flex}>
                      <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<InfoIcon />}
                          component={CustomRouterLink}
                          // onClick={() => onUserClick(user)}
                        to={window.dashboard_url + "/coupons/"+coupon.id}
                        >
                          {Lang.coupon.list.info}
                      </Button>
                      <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={<DeleteIcon />}
                          onClick={()=>onDeleteClick(coupon)}
                        >
                          {Lang.common.delete}
                      </Button>
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

UsersTable.propTypes = {
  className: PropTypes.string,
  coupons: PropTypes.array.isRequired
};

export default UsersTable;
