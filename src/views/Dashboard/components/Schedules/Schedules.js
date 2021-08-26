import React , { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { NavLink as RouterLink } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {
    Chip,
    Link,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Lang from "../../../../Language";
import store from "store";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{display:"inline-block"}}
  >
    <RouterLink {...props} />
  </div>
));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

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

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function CustomPaginationActionsTable(props) {
  const classes = useStyles2();
  const { rows } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  let emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  React.useEffect(() => {
      emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  } , [rows])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showLink = ()=>{
      let user = store.get("user");
      return !!user.permissions.find(k => k.slug =="user-manage");
  }

  return (
    <TableContainer >
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
            <TableRow>
                <TableCell>Package</TableCell>
                <TableCell align="right">Staff</TableCell>
                <TableCell align="right">User</TableCell>
                <TableCell align="right">Start Time</TableCell>
                <TableCell align="right">Session Held</TableCell>
                <TableCell align="right">Present</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.package.name + " - " + row.reserve.staff_package.duration + " " + Lang.common.minutes}
              </TableCell>
              <TableCell  align="right">
                {showLink() ? (
                <Link
                  component={CustomRouterLink}
                  to={window.dashboard_url + "/reports/users/" + row.reserve.staff_package.staff.user.id}
                >
                  {row.reserve.staff_package.staff.user.name + " " + row.reserve.staff_package.staff.user.family}
                </Link>
                ) : (row.reserve.staff_package.staff.user.name + " " + row.reserve.staff_package.staff.user.family)}
              </TableCell>
              <TableCell align="right">
                {showLink() ? (
                  <Link
                    component={CustomRouterLink}
                    to={window.dashboard_url + "/reports/users/" + row.reserve.user.id}
                  >
                    {row.reserve.user.name + " " + row.reserve.user.family}
                  </Link>
                ) : (row.reserve.user.name + " " + row.reserve.user.family)}
              </TableCell>
              <TableCell align="right">
                {row.date}
              </TableCell>
              <TableCell align="right">
                {row.hold == 1 ? (
                    <Chip label="Y" color="primary"/>
                ) : (
                    <Chip label="N" color="secondary"/>
                )}
              </TableCell>
              <TableCell align="right">
                {row.user_present == 1 ? (
                    <Chip label="Y" color="primary"/>
                ) : (
                    <Chip label="N" color="secondary"/>
                )}
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
              colSpan={6}
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
  );
}
