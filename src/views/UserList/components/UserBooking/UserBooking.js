import React, { useState ,forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import UserPackageList  from "../../../MyPackages";
import {UserBookingToolbar} from "./components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  marginTop: {
    marginTop: theme.spacing(1)
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
    >
      <RouterLink {...props} />
    </div>
  ));
  
const UserBooking = props => {

  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars

  // const [user, setUserInfo] = useState(getUserInfo(props.match.params.user_id));
  const [user_id] = useState(props.match.params.user_id);

  return (
    <div>
        <UserBookingToolbar user_id={user_id}/>
      <UserPackageList />
    </div>
  );
};


export default UserBooking;
