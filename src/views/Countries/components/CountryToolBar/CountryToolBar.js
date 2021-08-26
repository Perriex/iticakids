import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button , Dialog } from '@material-ui/core';

import Filter from "../../../Filter";
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const CountryToolBar = props => {
  const { className , onChange , onFilter , onAdd, ...rest } = props;

  const classes = useStyles();

  const search =  (e)=>{
    if(onChange){
      onChange(e.target.value);
    }
  }

  const onCountryFilter = (search, column, dir, length) =>{
    if(onFilter){
      onFilter (search, column, dir, length)
    }
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          color="primary"
          variant="contained"
          onClick={onAdd}
        >
          {Lang.countries.add}
        </Button>
      </div>
      <div >
        <Filter columns={[ "name" ,"created_at"]} onFilter={onCountryFilter}/>
      </div>
    </div>
  );
};

CountryToolBar.propTypes = {
  className: PropTypes.string
};

export default CountryToolBar;
