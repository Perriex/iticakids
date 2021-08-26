import React , { useState , Fragment , forwardRef} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { NavLink as RouterLink } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
    Button,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Loading from "../../../Loading";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import axios from "axios";
import moment from "moment";
import store from "store";
import Dialog from "../../../Dialog";

const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
      style={{ flexGrow: 1 }}
    >
      <RouterLink {...props} />
    </div>
  ));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'whorkshop', numeric: false, disablePadding: false, label: Lang.workshop.reserves.list.workshop },
  { id: 'user', numeric: false, disablePadding: false, label: Lang.workshop.reserves.list.user },
  { id: 'duration', numeric: false, disablePadding: false, label:  Lang.workshop.reserves.list.duration },
  { id: 'sessions', numeric: false, disablePadding: false, label:  Lang.workshop.reserves.list.sessions },
  { id: 'coupons', numeric: true, disablePadding: false, label: Lang.workshop.reserves.list.coupon },
  { id: 'price', numeric: false, disablePadding: false, label: Lang.workshop.reserves.list.price },
  { id: 'created_at', numeric: true, disablePadding: false, label: Lang.workshop.reserves.list.order_date},
  { id: 'paid', numeric: true, disablePadding: false, label: Lang.workshop.reserves.list.pay_state},
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
        right:{
            float : "right",
            margin : theme.spacing(1)
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { workshop_slug } = props;
    return (
        <div
        className={clsx(classes.root)}
        >
        <Button 
        variant="contained" 
        className={classes.right} 
        color="primary"
        component={CustomRouterLink}
        to={window.dashboard_url + "/workshops/" + workshop_slug + "/reserves/new"}
        >
            {Lang.workshop.reserves.list.reserve}
        </Button>
        </div>
    );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding : theme.spacing(3)
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  button : {
    marginTop : theme.spacing(1),
    marginLeft : theme.spacing(1),
  },
  borderRight : {
    borderRight : "1px solid #eee"
  }
}));

export default function EnhancedTable(props) {
    const classes = useStyles();
    const [workshop_slug] = useState(props.match.params.workshop_slug);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [ showLoading , setLoadingState ] = useState();
    const [ rows , setRows ] = useState([]);
    const [ workshop , setWorkshop ] = useState({});
    const [ row , setRow ] = useState({});
    const [ showDeleteDialog , setDeleteDialogState ] = useState(false);


    React.useEffect(() => {
        loadReserves();
    } , [])

    const loadReserves = () => {
        setLoadingState(true);
        axios.get(`api/admin/workshops/${workshop_slug}/reserves`).then(res => {
            setRows(res.data.reserves)
            setWorkshop(res.data)
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
        setLoadingState(true);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelecteds = rows.map((n) => n.name);
        setSelected(newSelecteds);
        return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const getPayLink = (token) => {
        // if(store.get("user").timezone.toLowerCase().includes("tehran")){
        //   window.location = axios.defaults.baseURL + "/pay/booking/zarrin?reserve_token="+token;
        // }else{
          window.location = axios.defaults.baseURL + "/pay/booking/paypal?reserve_token="+token;
        // }
    }

    const togglePayment = (row ,state) => {
        setLoadingState(true);
        setDeleteDialogState(false);
        let data = {
            state : !state
        };
        axios.post(`api/admin/workshops/${workshop_slug}/reserves/${row.id}` , data).then(res => {
            loadReserves();
            Toast(Lang.common.success, "success")
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
        setLoadingState(true);
    }

    const getPayBtn = (row) => {
        return  (
            <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {togglePayment(row ,row.paid)}}
        >
            {row.currency == "USD" ? Lang.my_packages.list.not_paid : Lang.my_packages.list.pay}
        </Button>
        )
    }

    const setDelete = (row) => {
        setRow(row);
        setDeleteDialogState(true);
    }

    const deleteReserve = () => {
        setLoadingState(true);
        setDeleteDialogState(false);
        axios.delete(`api/admin/workshops/${workshop_slug}/reserves/${row.id}`).then(res => {
            loadReserves();
            Toast(Lang.common.success, "success")
            
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
    }

    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading/>
            ) : (
                <Fragment>
                    <Paper className={classes.paper}>
                        <Dialog 
                        open_dialog={showDeleteDialog}
                        msg={Lang.common.delete_msg}
                        title={Lang.common.warning}
                        negative_btn={Lang.common.cancel}
                        positive_btn={Lang.common.yes} 
                        on_negative_btn={() => {setDeleteDialogState(false)}}
                        on_positive_btn={deleteReserve}
                        />
                        <EnhancedTableToolbar workshop_slug={workshop_slug} numSelected={selected.length} />
                        <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            />
                            <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isItemSelected}
                                    >
                                    <TableCell  className={classes.borderRight} component="th" id={labelId} scope="row" >
                                        {workshop.title}
                                    </TableCell>
                                    <TableCell className={classes.borderRight}>{row.user.name + " " + row.user.family}</TableCell>
                                    <TableCell className={classes.borderRight} >{workshop.duration}</TableCell>
                                    <TableCell className={classes.borderRight} >{workshop.sessions.length}</TableCell>
                                    <TableCell className={classes.borderRight} >{row.coupon ? row.coupon : "-"}</TableCell>
                                    <TableCell className={classes.borderRight} >{row.currency == "USD" ? row.price + " $" : row.ir_price + " IRT"}</TableCell>
                                    <TableCell  className={classes.borderRight}>{moment(row.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                                    <TableCell >
                                            { row.paid == 1 ? (
                                            <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            onClick={() => {togglePayment(row ,row.paid)}}
                                        >
                                            {Lang.my_packages.list.paid}
                                        </Button>
                                            ) : getPayBtn(row)}
                                            <Button
                                            variant="contained"
                                            color="secondary"
                                            className={classes.button}
                                            onClick={() => {setDelete(row)}}
                                            >
                                                {Lang.my_packages.list.delete}
                                            </Button>
                                    </TableCell>
                                    </TableRow>
                                );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Dense padding"
                    />
                </Fragment>
            )}
        </div>
    );
}
