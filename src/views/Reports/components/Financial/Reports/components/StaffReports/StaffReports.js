import React , {useState , Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Collapse ,
    Box ,
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Loading from "../../../../../../Loading";
import axios from "axios";
import moment from "moment";
import Lang from "../../../../../../../Language"
import store from "store";
import { StaffReportsToolbar } from "../index";


function descendingComparator(a, b, orderBy) {
  if(orderBy == "user"){
    if ((b[orderBy].name + " " + b[orderBy].family) < (a[orderBy].name  + " " + a[orderBy].family)) {
      return -1;
    }
    if ((b[orderBy].name + " " + b[orderBy].family) > (a[orderBy].name + " " + a[orderBy].family)) {
      return 1;
    }
  }else if(orderBy == "staff_package"){
    if ((b[orderBy].staff_package.package.name) < (a[orderBy].staff_package.package.name)) {
      return -1;
    }
    if ((b[orderBy].staff_package.package.name) > (a[orderBy].staff_package.package.name)) {
      return 1;
    }
  }else if(orderBy == "duration"){
    if ((b[orderBy].staff_package.duration) < (a[orderBy].staff_package.duration)) {
      return -1;
    }
    if ((b[orderBy].staff_package.duration) > (a[orderBy].staff_package.duration)) {
      return 1;
    }
  }else{
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
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
  { id: 'user', numeric: true, disablePadding: true, label: Lang.reports.reserves.list.user },
  { id: 'staff_package', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.package },
  { id: 'duration', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.duration},
  { id: 'price', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.price },
  { id: 'coupon', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.coupon},
  { id: 'off_percent', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.off_percent },
  { id: 'staff_income', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.staff_income},
  { id: 'site_income', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.site_income},
  { id: 'currency', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.currency},
  { id: 'timezone', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.timezone },
  { id: 'created_at', numeric: true, disablePadding: false, label: Lang.reports.reserves.list.paid_at },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
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
              className={classes.spaceLeft}
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
  spaceLeft : {
    padding : theme.spacing(1)
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
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      
      
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding : theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginTop: theme.spacing(2),
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
  borderRight : {
      borderRight: "1px solid #eeeeee"
  }
  
}));

export default function StaffReports(props) {
    const classes = useStyles();

    const [ staff_id ] = useState(props.match.params.staff_id);
    

    React.useEffect(( ) => {
        getReserves();
    } , []);


    const [ showLoading , setLoadingState ] = useState(true);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [ staff , setStaff ] = useState({});
    const [ rows , setRows ] = useState([]);
    const [ timezone , setTimezone ] = useState("");
    const [ search , setSearch ] = useState("");
    const [ duration , setDuration ] = useState("");
    const [ c_package , setPackage ] = useState("");

    const getReserves = (filter) => {
        setLoadingState(true)
        axios.post(`api/admin/reports/${staff_id}` , filter).then(res => {
            setStaff(res.data);
            setRows(res.data.reserves);
            setLoadingState(false)
        }).catch(err => {
            setLoadingState(false)
        })
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

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }

        setSelected(newSelected);
    };

    
    const getDateByTimezone = (date , timezone) =>{
      if(!timezone){
        timezone = store.get("user").timezone;
      }
      return moment.utc(date).tz(timezone);
    }


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

    const setScheduleOpen = (index , state) => {
      let _rows = [...rows];
      _rows[index].open = state;
      setRows(_rows);
    }

    const fetchFilteredData = () => {
      // timezone
      // search
      // duration
      // c_package
      let data = [...rows];
      if(search){
        data = data.filter(k => (k.user.name + " " + k.user.family).toLowerCase().includes(search.toLowerCase()));
      }
      if(timezone){
        data = data.filter(k => (k.timezone.toLowerCase()) == (timezone.toLowerCase()));
      }
      if(duration){
        data = data.filter(k => (k.staff_package.duration + "").includes(duration));
      }
      if(c_package){
        data = data.filter(k => (k.staff_package.package.name).includes(c_package));
      }
      return data;
    }

    return (
        <div className={classes.root}>
            
                <Fragment>
                    {showLoading ? (
                        <Loading/>
                    ) : (
                        <Grid container>
                            <Grid item xs={12} md={2}  component={Paper}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={staff.user.name}
                                        src={staff.user.avatar ? axios.defaults.baseURL + staff.user.avatar : null}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={staff.user.name + " " + staff.user.family} />
                            </ListItem>
                            </Grid>
                        </Grid>
                    )}
                    <Paper className={classes.paper}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                        <StaffReportsToolbar 
                          onFilter={getReserves}
                          onTimezone={setTimezone} 
                          onSearch={setSearch} 
                          onDuration={setDuration} 
                          onPackage={setPackage} 
                          data={rows}
                          />
                        <TableContainer>
                        {showLoading ? (
                              <Loading/>
                          ) : (
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
                                  rowCount={fetchFilteredData().length}
                                  />
                                  <TableBody>
                                  {stableSort(fetchFilteredData(), getComparator(order, orderBy))
                                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                      .map((row, index) => {
                                      const isItemSelected = isSelected(row.name);
                                      const labelId = `enhanced-table-checkbox-${index}`;

                                      return (
                                        <React.Fragment>
                                          <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                            >
                                            <TableCell>
                                              <IconButton aria-label="expand row" size="small" onClick={() => setScheduleOpen(index,!row.open)}>
                                                {row.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                              </IconButton>
                                            </TableCell>
                                            <TableCell component="th"  className={classes.borderRight} id={labelId} scope="row" padding="none">
                                              <ListItem >
                                                <ListItemAvatar>
                                                  <Avatar alt={row.user.name + " " + row.user.family} src={row.user.avatar ? axios.defaults.baseURL + row.user.avatar : null} />
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary= {row.user.name + " " + row.user.family} />
                                              </ListItem>
                                            </TableCell>
                                            <TableCell component="th"  className={classes.borderRight} id={labelId} scope="row" padding="none">
                                              <ListItem >
                                                <ListItemAvatar>
                                                  <Avatar alt={row.staff_package.package.name} src={row.staff_package.package.image ? axios.defaults.baseURL + row.staff_package.package.image : null} />
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary= {row.staff_package.package.name} />
                                              </ListItem>
                                            </TableCell>
                                            <TableCell className={classes.borderRight}>{row.staff_package.duration}</TableCell>
                                            <TableCell className={classes.borderRight}>{(row.currency == "USD" ? row.price : row.ir_price) + " " +  row.currency}</TableCell>
                                            <TableCell className={classes.borderRight}>{row.coupon ? row.coupon : "-"}</TableCell>
                                            <TableCell className={classes.borderRight}>{row.off_percent}</TableCell>
                                            <TableCell className={classes.borderRight}>{row.staff_income + " " + row.currency}</TableCell>
                                            <TableCell className={classes.borderRight}>{row.site_income + " " + row.currency}</TableCell>
                                            <TableCell className={classes.borderRight}>{row.currency}</TableCell>
                                            <TableCell  className={classes.borderRight}>{row.timezone}</TableCell>
                                            <TableCell >{moment(row.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                              <Collapse in={row.open} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                  <Typography variant="h6" gutterBottom component="div">
                                                    {Lang.reports.reserves.sessions.title}
                                                  </Typography>
                                                  <Table size="medium" aria-label="purchases">
                                                    <TableHead>
                                                      <TableRow>
                                                        <TableCell>
                                                          {Lang.reports.reserves.sessions.date}
                                                        </TableCell>
                                                        <TableCell>
                                                          {Lang.reports.reserves.sessions.student_date}
                                                        </TableCell>
                                                        <TableCell>
                                                          {Lang.reports.reserves.sessions.index}
                                                        </TableCell>
                                                        <TableCell>
                                                          {Lang.reports.reserves.sessions.is_last}
                                                        </TableCell>
                                                        <TableCell >
                                                          {Lang.reports.reserves.sessions.hold}
                                                        </TableCell>
                                                        <TableCell >
                                                          {Lang.reports.reserves.sessions.user_state}
                                                        </TableCell>
                                                      </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                      {row.schedules.map((session , i) => (
                                                        <TableRow key={session.id}>
                                                          <TableCell>{getDateByTimezone(session.date).format("YYYY-MM-DD HH:mm")}</TableCell>
                                                          <TableCell>{getDateByTimezone(session.date , row.timezone ).format("YYYY-MM-DD HH:mm")}</TableCell>
                                                          <TableCell>{i+1} from {row.schedules.length}</TableCell>
                                                          <TableCell>{session.is_last ? Lang.reports.reserves.sessions.true : Lang.reports.reserves.sessions.false }</TableCell>
                                                          <TableCell >{session.hold == 0 ? "N" : (session.hold == 1 ? "Y" : "H")}</TableCell>
                                                          <TableCell >{session.user_present ? "P" : "A"}</TableCell>
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
                                      })}
                                  {emptyRows > 0 && (
                                      <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                      <TableCell colSpan={12} />
                                      </TableRow>
                                  )}
                                  </TableBody>
                              </Table>
                              
                          )}
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
        </div>
    );
}
