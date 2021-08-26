import React , { Fragment , forwardRef}  from "react"
import PropTypes from 'prop-types';
import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button,
    TableFooter,
    TablePagination,
    Paper,
    Typography,
} from '@material-ui/core';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import IconButton from '@material-ui/core/IconButton';
import Lang from "../../../../../../Language"

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
  
const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
    >
      <RouterLink {...props} />
    </div>
  ));

  const useStyles2 = makeStyles(theme => ({
    table: {
      minWidth: 500,
    },
    root : {
        padding : theme.spacing(3)
    },
    marginBottom: {
        marginBottom : theme.spacing(2)
    },
    right : {
        float : "right"
    }
  }));
const InvoicesTable = (props) => {
    const classes = useStyles2();
    const { rows , type , isStaff} = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Fragment>
            {rows.length ? (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableBody>
                    <TableRow >
                        <TableCell component="th" scope="row">
                            {Lang.reports.invoices.list.start_date}
                        </TableCell>
                        <TableCell   >
                          {Lang.reports.invoices.list.end_date}
                        </TableCell>
                        <TableCell  >
                            
                        </TableCell>
                    </TableRow>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                            {row.start_date}
                        </TableCell>
                        <TableCell   >
                            {row.end_date}
                        </TableCell>
                        <TableCell  >
                            <Button 
                                color="primary"  
                                variant="contained" 
                                component={CustomRouterLink} 
                                to={isStaff ? (window.dashboard_url + "/invoices/" + row.id) : (window.dashboard_url + "/reports/financial/invoices/" + row.staff_id + "/" + type + "/" + row.id) }
                            >
                                {Lang.reports.invoices.list.info}
                            </Button>
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
        
        ) : (
            <Paper className={classes.root}>
                <Typography variant="h4">
                    {Lang.reports.invoices.no_invoice}
                </Typography>
            </Paper>
        )}
        </Fragment>
    )
}



export default InvoicesTable;