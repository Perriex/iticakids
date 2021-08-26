import React, { useState , Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
  Grid, 
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from '@material-ui/core';
import StaffPackageList from "../../../StaffList/components/StaffPackages";
import axios from "axios";
import Loading from "../../../Loading";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import {withRouter} from  'react-router-dom';

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

const StaffPackages = (props) => {
  const classes = useStyles();
  
  const { staff_id } = props;
  // const 
  const [packages , setPackages ] = useState([]);
  const [staff , setStaff ] = useState({});

  React.useEffect(() => {
    getStaff();
  } , []);

  const getStaff = () => {
    let data = {
      staff_id : staff_id ? staff_id : null
    }
    axios.post(`api/staff`,data).then(res => {
      setPackages(res.data.data.packages);
      setStaff(res.data.data.staff);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      Toast(Lang.common.connection_error, "danger");
    });
  };


  const [ showLoading ,setLoading ] = useState(true);

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <Fragment>
          { staff_id ? (
              <Grid container>
                <Grid item xs={12} md={2}  component={Paper}>
                  <ListItem>
                    <ListItemAvatar>
                        <Avatar
                            alt={staff.name}
                            src={staff.avatar ? axios.defaults.baseURL + staff.avatar : null}
                        />
                    </ListItemAvatar>
                    <ListItemText primary={staff.name + " " + staff.family} />
                  </ListItem>
                </Grid>
              </Grid>
          ) : null}
          <StaffPackageList packages={packages} is_owner={true}/>
        </Fragment>
      )}
    </div>
  );
};


export default withRouter(StaffPackages);
