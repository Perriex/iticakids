import React, { useState , Fragment ,forwardRef} from 'react';
import { makeStyles } from '@material-ui/styles';
import {withRouter} from  'react-router-dom';
import { NavLink as RouterLink } from 'react-router-dom';
import RenewPackageInfo from "../MyPackageInfo";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));


const RenewPackage = (props) => {
  const classes = useStyles();

    const [myPackage , setMyPackage] = useState(null);
    const [reserve_id] = useState(props.match.params.reserve_id);
    const [schedules , setSchedules] = useState([]);
    const [showLoading , setLoading] = useState(true);

  React.useEffect(() => {

  } , [])

  

  return (
    <div className={classes.root}>
        <RenewPackageInfo />
    </div>
  );
};

export default withRouter(RenewPackage);
