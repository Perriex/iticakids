import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button , Dialog } from '@material-ui/core';

import { SearchInput } from '../../../../components';
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

const PackagesToolbar = props => {
  const { className , onChange , onAdd, ...rest } = props;

  const classes = useStyles();

  const search =  (e)=>{
    if(onChange){
      onChange(e.target.value);
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
          {Lang.packages.add}
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder={Lang.filter.search}
          onChange={search}
        />
      </div>
    </div>
  );
};

PackagesToolbar.propTypes = {
  className: PropTypes.string
};

export default PackagesToolbar;
