import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import axios from "axios";
import Loading from "../Loading";
import Lang from "../../Language";
import store from "store";
import {withRouter} from  'react-router-dom';
import Dialog from "../Dialog";
import config from "../../website.config"

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

const MyPackages = (props) => {
  const classes = useStyles();

  const [showLogoutLoading , setShowLogoutLoading] = useState(false);

  React.useEffect(() => {
    // logout();
  } , []);
  const logout = (page) => {
    axios.get('api/auth/logout').then(res => {
        store.set("user" , null);
        store.set("token" , null);
        window.location.href = config.siteURL + '/signIn';
    }).catch(err => {
        props.history.push(window.dashboard_url + '/account');
    });
  };

  return (
    <div className={classes.root}>
         <Dialog open_dialog={true} 
        msg={Lang.profile.logout} 
        negative_btn={Lang.common.cancel} 
        positive_btn={Lang.common.yes} 
        showLoading={showLogoutLoading}
        on_negative_btn={() => {
          window.location.href = window.dashboard_url;
        }}
        on_positive_btn = {() => {
          setShowLogoutLoading(true);
          logout();
        }}
        />
    </div>
  );
};

export default withRouter(MyPackages);
