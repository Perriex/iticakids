import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
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
  TableRow,
  Typography,
  Button,
  TablePagination
} from '@material-ui/core';
import Lang from "../../../../Language";


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
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
    margin: theme.spacing(1),
  },
}));


const CountryTable = props => {
  const { className, countries , countryEditClick , countryDeleteClick , paginate , setPage , countryPackagesListClick, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [page, setPage] = useState(0);


  const handleSelectAll = event => {
    const { countries } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = countries.map(country => country.id);
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

  const countryPackages = (country) => {
    if(countryPackagesListClick){
      countryPackagesListClick(country);
    }
  }

  const countryDelete = (country)=>{
    if(countryDeleteClick){
      countryDeleteClick(country);
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
                  <TableCell >{Lang.countries.list.name}</TableCell>
                  <TableCell>{Lang.countries.list.options}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {countries.slice(0, parseInt(paginate.per_page)).map((country , i) => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={i}
                    selected={selectedUsers.indexOf(country.id) !== -1}
                  >
                    <TableCell fullwidth="true" >
                      <Typography
                      onClick={()=>countryEditClick(country)}
                      >
                        {country.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<EditIcon />}
                        onClick={()=>countryEditClick(country)}
                      >
                        {Lang.common.edit}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<ListIcon />}
                        onClick={()=>countryPackages(country)}
                      >
                        {Lang.countries.packages}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<DeleteIcon />}
                        onClick={()=>countryDelete(country)}
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

CountryTable.propTypes = {
  className: PropTypes.string,
  countries: PropTypes.array.isRequired
};

export default CountryTable;
