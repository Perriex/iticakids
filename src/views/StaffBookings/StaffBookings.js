import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {StaffPackages} from "./components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const StaffBookings = (props) => {
  const classes = useStyles();

  const {is_picker , onUserPick} = props;

  const [users] = useState([]);
  const [openActivateDialog , setActivateDialogState] = useState(false);
  const [selectedUser , setSelectedUser] = useState(null);

  const toggleActivate = (user)=>{
    setSelectedUser(user);
    setActivateDialogState(true);
  }

  const onActivateDialogClosed = ()=>{
    setActivateDialogState(false);
  }

  const onUserClick = (user)=>{
    
  }

  return (
    <div className={classes.root}>
        <StaffPackages/>
    </div>
  );
};

export default StaffBookings;


