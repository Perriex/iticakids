import React, { useState  , Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import UserPackageInfo  from "../../../MyPackages/components/MyPackageInfo";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  marginTop: {
    marginTop: theme.spacing(1)
  }
}));

const UserBookingInfo = props => {

  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { openDialog, onDialogClosed, current_package } = props;

  // const [user, setUserInfo] = useState(getUserInfo(props.match.params.user_id));
  const [user, setUserInfo] = useState({});
  const [showLoading, setLoadingState] = useState(true);
  const [ newProfile , setNewProfile ] = useState(false)

  return (
    <div>
      <UserPackageInfo />
    </div>
  );
};


export default UserBookingInfo;
