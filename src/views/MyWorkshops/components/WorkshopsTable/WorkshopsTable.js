import React, { useState, forwardRef, Fragment } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
// import Ring from '@bit/joshk.react-spinners-css.ring';
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
import Lang from "../../../../Language";
import axios from "axios";
import store from "store";
import { withRouter } from 'react-router-dom';
import DeleteDialog from "../../../Dialog";
import Loading from "../../../Loading";
import { Alert } from '@material-ui/lab';


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
    marginTop: theme.spacing(1)
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


const WorkshopsTable = props => {
  const { className, myPackages, paginate, setPage, ...rest } = props;

  const classes = useStyles();

  const [user_id] = useState(props.match.params.user_id);
  //   const [selectedUsers, setSelectedUsers] = useState([]);
  const [current_reserve, setCurrentReserve] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showLoading, setLoadingState] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading_id, setLoadingId] = useState();
  const [showDeleteDialog, setDeleteDilogState] = useState(false);
  const [isMyPackages, setIsMyPackages] = useState(!Boolean(props.match.params.user_id));

  React.useEffect(() => {
    setPackages(myPackages);
  }, [myPackages]);


  const handlePageChange = (event, page) => {
    if (setPage) {
      setPage(page + 1);
    }
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);

  };

  const getPayLink = (token) => {
    // if(store.get("user").timezone.toLowerCase().includes("tehran")){
    //   window.location = axios.defaults.baseURL + "/pay/workshops/zarrin?reserve_token="+token;
    // }else{
    window.location = axios.defaults.baseURL + "/pay/workshop/paypal?reserve_token=" + token + '&site_id=7';
    // }
  }

  const getPayBtn = (mPakcage) => {
    return user_id ? null : (
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        // onClick={!mPakcage.currency == "USD" ? null : () => getPayLink(mPakcage.reserve_token ) }
        onClick={() => getPayLink(mPakcage.reserve_token)}
      >
        {/* {!mPakcage.currency == "USD" ? Lang.my_packages.list.pending : Lang.my_packages.list.pay} */}
        {Lang.my_packages.list.pay}
      </Button>
    )
  }

  const setPaid = (id) => {
    setLoadingId(id)
    let data = {
      user_id: user_id
    }
    axios.post(`api/admin/users/packages/${id}/toggle_pay`, data).then(res => {
      window.location.reload(false);
      setLoadingId(null)
    }).catch(err => {
      window.location.reload(false);
      setLoadingId(null)
    });
  }

  const setDelete = (reserve) => {
    setCurrentReserve(reserve);
    setDeleteDilogState(true);
  }

  const onDeleteDialogCancel = () => {
    setCurrentReserve({});
    setDeleteDilogState(false);
  }

  const onDeleteDialogOk = () => {
    // setCurrentReserve({});
    deleteReserve();
    setDeleteDilogState(false);
  }

  const deleteReserve = () => {
    setLoadingState(true);
    let data = {
      user_id: user_id || current_reserve.user_id,
      workshop: true
    }
    let url
    url = isMyPackages ? `api/user/myPackages/${current_reserve.id}/delete` : `api/admin/users/packages/${current_reserve.id}/delete`
    axios.post(url, data).then(res => {
      // window.location.reload(false);
      // setLoadingState(false);
    }).catch(err => {
      // window.location.reload(false);
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
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <DeleteDialog
                  msg={Lang.common.delete_msg}
                  title={Lang.common.warning}
                  negative_btn={Lang.common.cancel}
                  on_negative_btn={onDeleteDialogCancel}
                  positive_btn={Lang.common.delete}
                  on_positive_btn={onDeleteDialogOk}
                  open_dialog={showDeleteDialog}
                />
                <Alert severity="error">Your unpaid workshops/packages will be valid for up to one hour</Alert>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{Lang.my_packages.list.package}</TableCell>
                      <TableCell>{Lang.my_packages.list.instructor}</TableCell>
                      <TableCell>{Lang.my_packages.list.dur}</TableCell>
                      <TableCell>{Lang.my_packages.list.schedules}</TableCell>
                      <TableCell>{Lang.my_packages.list.coupon}</TableCell>
                      <TableCell>{Lang.my_packages.list.price}</TableCell>
                      <TableCell>{Lang.my_packages.list.pay_state}</TableCell>
                      <TableCell>{Lang.my_packages.list.date_ordered}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {packages.slice(0, parseInt(paginate.per_page)).map((mPakcage, i) => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={i}
                      >

                        <TableCell>{mPakcage.workshop.title}</TableCell>
                        <TableCell>{mPakcage.workshop.staff.user.name + " " + mPakcage.workshop.staff.user.family}</TableCell>
                        <TableCell>{mPakcage.workshop.duration} {Lang.my_packages.list.minutes}</TableCell>
                        <TableCell>{mPakcage.workshop.sessions.length}</TableCell>
                        <TableCell>{mPakcage.coupon ? mPakcage.coupon : "-"}</TableCell>
                        <TableCell>{mPakcage.currency == "USD" ? (mPakcage.price + " $") : (mPakcage.ir_price + " IRT")}</TableCell>
                        <TableCell>
                          <Chip
                            onClick={() => { if (user_id) setPaid(mPakcage.id) }}
                            label={(
                              <span>
                                {mPakcage.paid == 1 ? Lang.my_packages.list.paid : Lang.my_packages.list.not_paid}
                                {loading_id == mPakcage.id ?
                                  // <Ring size={20}/> 
                                  <></>
                                  : null}
                              </span>
                            )} color={mPakcage.paid ? "primary" : "secondary"} />
                        </TableCell>

                        <TableCell>{moment(mPakcage.created_at).format("Y-M-D H:m")}</TableCell>
                        <TableCell>
                          {mPakcage.paid == 1 ? (
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              startIcon={<InfoIcon />}
                              component={CustomRouterLink}
                              // onClick={() => onUserClick(user)}
                              to={window.dashboard_url + (user_id ? "/reports/users/" + user_id + "/booking/" + mPakcage.id : "/myworkshops/" + mPakcage.id)}
                            >
                              {Lang.my_packages.list.info}
                            </Button>
                          ) : getPayBtn(mPakcage)
                          }
                          {(!isMyPackages) ?
                            (
                              <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<DeleteIcon />}
                                onClick={() => { setDelete(mPakcage) }}
                              >
                                {Lang.my_packages.list.delete}
                              </Button>
                            )
                            :
                            mPakcage.paid == 1 ? null
                              :
                              (
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  className={classes.button}
                                  startIcon={<DeleteIcon />}
                                  onClick={() => { setDelete(mPakcage) }}
                                >
                                  {Lang.my_packages.list.delete}
                                </Button>
                              )}
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
      )}
    </Fragment>
  );
};

WorkshopsTable.propTypes = {
  className: PropTypes.string,
  myPackages: PropTypes.array.isRequired
};

export default withRouter(WorkshopsTable);
