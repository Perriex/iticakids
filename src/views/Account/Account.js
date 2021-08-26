import React , {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import { AccountProfile, AccountDetails , AccountPassword } from './components';
import { UserPermissions } from "../UserList/components";
import store from 'store';
import Loading from "../Loading";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  space : {
    marginTop : theme.spacing(4)
  }
}));


const getUser = (callback) => {
  axios.get('api/user').then(res => {
    callback(res);
  }).catch(err => {});
};

const Account = (props) => {
  const {user_info, newProfile} = props;
  const [user , setUser] = useState(user_info ? user_info : {});
  const [showLoading , setLoadingState] = useState(true);
  React.useEffect(() => {
    if(user_info){
      setUser(user_info);
      setLoadingState(false);
    }else{
      getUser(res => {
        setUser(res.data.data);
        setLoadingState(false);
      });
    }
  }, [user_info]);
  const classes = useStyles();

  const isAdmin = () => {
    try {
      return !!store.get("user").permissions.find(k => k.slug == "user-manage")
    } catch (error) {
      return false;
    }
  }

  const isMe = () => {
    try {
      return store.get("user").id == user.id;
    } catch (error) {
      return false;
    }
  }

  const getView = () => {
    return(
      <div>
        {!newProfile ? (
          <Grid container spacing={4} >
          <Grid item lg={4} md={6} xl={4} xs={12} >
            <AccountProfile user={user} />
            <AccountPassword user={user} className={classes.space} />
            {isAdmin() && !isMe() ? (
              <UserPermissions user_info={user} className={classes.space}  user_permissions={user.permissions}/>
            ) : null}
          </Grid>
          <Grid item lg={8} md={6} xl={8} xs={12} >
            <AccountDetails user={user}/>
          </Grid>
        </Grid>
        ) : (
          <AccountDetails user={user}/>
        )}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading/>
      ) : 
        getView()
      }
    </div>
  );
};

export default Account;
