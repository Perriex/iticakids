import React  , {forwardRef} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Button , Dialog } from '@material-ui/core';

import Filter from "../../../../Filter";
import Lang from "../../../../../Language";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{display:"inline-block"}}
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
  button:{
    marginLeft : theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const PostsToolBar = props => {
  const { className , onChange , categoris , onFilter , onAdd , onCategory, ...rest } = props;

  // React.useEffect(() => {

  // } , [categoris]);

  const classes = useStyles();

  const search =  (e)=>{
    if(onChange){
      onChange(e.target.value);
    }
  }

  const onCountryFilter = (search, column , category, dir, length) =>{
    if(onFilter){
      onFilter (search, column , category, dir, length)
    }
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div >
        <Filter columns={[ "title" ,"created_at"]} categories={categoris} onFilter={onCountryFilter}/>
      </div>
    </div>
  );
};

PostsToolBar.propTypes = {
  className: PropTypes.string
};

export default PostsToolBar;
