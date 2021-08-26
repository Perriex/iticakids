import React , {forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import {
  Tooltip,
  Chip,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { NavLink as RouterLink } from 'react-router-dom';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import InfoIcon from "@material-ui/icons/Info"
import DeleteIcon from "@material-ui/icons/Delete"
import SendIcon from "@material-ui/icons/Send"
import axios from "axios";
import Loading from "../../../Loading";
import moment from "moment";
import Dialog from "../../../Dialog";
import Lang from "../../../../Language";
import { Toast } from "./../../../../config/ToastConfig/Toast.config"

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <span
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </span>
));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const useStyles2 = makeStyles((theme) => ({
    table: {
        
    },
    root : {
        margin : theme.spacing(3)
    },
    marginBottom : {
        marginBottom : theme.spacing(3)
    },
    button : {
        margin : theme.spacing(1)
    }
  }));

export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [showLoading, setLoadingState] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [ rows , setTemplates ] = React.useState([]);
  const [ openDeleteDialog , setDeleteDialogState ] = React.useState(false);
  const [ openSendDialog , setSendDialogState ] = React.useState(false);
  const [ current_template , setCurrentTemplate ] = React.useState({});

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  React.useEffect(() => {
    loadTemplates();
  } , [])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loadTemplates = () => {
      setLoadingState(true);
      axios.get("api/admin/templates/notifications").then(res => {
        setTemplates(res.data);
        setLoadingState(false);
      }).catch(err => {
        
        Toast(Lang.common.connection_error , "danger");
        setLoadingState(false);
      })
  }
  
  const deleteTemplate = () => {
      setLoadingState(true);
      axios.delete(`api/admin/templates/notifications/${current_template.id}`).then(res => {
          loadTemplates();
          setLoadingState(false);
          
          Toast(Lang.common.success , "success");
      }).catch(err => {
        
        Toast(Lang.common.connection_error , "danger");
        setLoadingState(false);
      })
  }

  const sendTemplate = () => {
    setLoadingState(true);
    axios.get(`api/admin/templates/notifications/${current_template.id}/send`).then(res => {
        Toast(Lang.common.success , "success");
        setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    })
  }

  return (
      <div  className={classes.root} >
        {showLoading ? (
            <Loading />
        ) : (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.marginBottom}
                    component={CustomRouterLink}
                    // onClick={() => onUserClick(user)}
                    to={window.dashboard_url + "/settings/templates/new"}
                    >
                    {Lang.templates.new}
                </Button>
                <Dialog 
                    open_dialog={openDeleteDialog}
                    msg={Lang.common.delete_msg}
                    title={Lang.common.warning}
                    negative_btn={Lang.common.cancel}
                    positive_btn={Lang.common.yes}
                    on_negative_btn={() => {
                        setDeleteDialogState(false);
                    }} 
                    on_positive_btn={() => {
                        setDeleteDialogState(false);
                        deleteTemplate();
                    }}
                />
                <Dialog 
                    open_dialog={openSendDialog}
                    msg={Lang.templates.list.send_msg}
                    negative_btn={Lang.common.cancel}
                    positive_btn={Lang.common.yes}
                    on_negative_btn={() => {
                      setSendDialogState(false);
                    }} 
                    on_positive_btn={() => {
                      setSendDialogState(false);
                      sendTemplate();
                    }}
                />
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="custom pagination table">
                        <TableBody>
                            <TableRow >
                                <TableCell component="th" scope="row">
                                {Lang.templates.list.title}
                                </TableCell>
                                <TableCell align="right">
                                {Lang.templates.list.created_at}
                                </TableCell>
                                <TableCell align="right">
                                {Lang.templates.list.is_default}
                                </TableCell>
                                <TableCell align="right">
                                    
                                </TableCell>
                            </TableRow>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row) => (
                            <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell align="right">
                                {moment(row.created_at).format("YYYY-MM-DD HH:mm")}
                            </TableCell>
                            <TableCell>
                              {row.is_default == 1? (
                                <Chip color="primary" label="Y"/>
                              ) : (
                                <Chip color="secondary" label="N"/>
                              )}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title={Lang.templates.list.info}>
                                  <IconButton
                                    color="primary"
                                    className={classes.button}
                                    component={CustomRouterLink}
                                    // onClick={() => onUserClick(user)}
                                    to={window.dashboard_url + "/settings/templates/" + row.id}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={Lang.templates.list.send}>
                                  <IconButton
                                    color="primary"
                                    className={classes.button}
                                    onClick={() => {
                                        setCurrentTemplate(row);
                                        setSendDialogState(true);
                                    }}
                                  >
                                    <SendIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={Lang.templates.list.delete}>
                                  <IconButton
                                    color="secondary"
                                    className={classes.button}
                                    onClick={() => {
                                        setCurrentTemplate(row);
                                        setDeleteDialogState(true);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                            </TableCell>
                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        </TableBody>
                        <TableFooter>
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        ) }
      </div>
  );
}
