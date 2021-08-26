import React , {forwardRef} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from '../../../../components';
import {Filter} from "../../../index";

import Lang from "../../../../Language";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


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

const StaffsToolbar = props => {
  const { className , onFilter, ...rest } = props;

  const classes = useStyles();

  const onStaffFilter = (search , column , dir , length)=>{
    if(onFilter){
      onFilter(search , column , dir , length);
    }
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div>
        
        <Filter columns={["name" , "family" , "created_at" , "is_active" , "email"]} onFilter={onStaffFilter}/>
      </div>
    </div>
  );
};

StaffsToolbar.propTypes = {
  className: PropTypes.string
};

export default StaffsToolbar;
