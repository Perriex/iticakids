import React , {forwardRef ,useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import Lang from "../../../../../../Language";
import { lang } from 'moment';
import StaffPackageList from "../StaffPackageList";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
  root: {
      marginRight: theme.spacing(3)
  },
}));

const NewBooking = props => {
  const { ...rest } = props;

  const [user_id] = useState(props.match.params.user_id);

  const classes = useStyles();

  return (
    <div>
     <StaffPackageList user_id={user_id}/>
    </div>
  );
};

export default NewBooking;
