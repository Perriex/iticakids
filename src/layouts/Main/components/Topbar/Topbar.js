import React, { useState , forwardRef , Fragment} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Menu,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import Language from "./../../../../Language";
import logo from '../../../../assets/general/logo.svg';
import Dialog from "../../../../views/Dialog/Dialog";
import Lang from "../../../../Language/index";
import store from "store";
import config from "../../../../website.config";
import PeopleIcon from '@material-ui/icons/People';
import MailOutlineIcon from '@material-ui/icons/Mail';
import StarBorderIcon from '@material-ui/icons/Star';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from "axios";
import moment from "moment"
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  dir:{
    direction : Language.direction
  },
  logo : {
    maxWidth : 200,
    height : 50
  },
  sites : {
    minWidth : 150
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  title : {
    color: "#fff"
  },
  maxMenuHeight : {
    maxHeight : "250px",
    overflow  : "auto"
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    className={useStyles().right}
  >
    <RouterLink {...props} />
  </div>
));

const checkChachedIds = (key , ids) => {
  let olds = store.get(key);
  if(!olds) return ids;
  return ids.filter( k => !olds.includes(k));
}

const chachedId = (key , id) => {
  let olds = store.get(key);
  if(!olds) {
    olds = [];
  };

  olds.push (id);
  store.set(key , olds);
}



const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;
  const [showLogout , setShowLogout] = useState(false);
  const [showLogoutLoading , setShowLogoutLoading] = useState(false);
  const [ sites , setSites ] = useState([]);
  const [ logs , setLogs] = useState({join : [] ,chats : [] , logs : []});
  const classes = useStyles();
  const [ site_token , setSiteToken] = useState(axios.defaults.headers.common['site']);

  const [notifications] = useState([]);
  const [openUsersMenu , setUsersMenuState ] = useState(false);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorNotiEl, setNotiAnchorEl] = React.useState(null);
  const [anchorChatEl, setChatAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openNoti = Boolean(anchorNotiEl);
  const idNoti = openNoti ? 'simple-popover' : undefined;

  const handleNotiClick = (event) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleChatClick = (event) => {
    setChatAnchorEl(event.currentTarget);
  };

  const handleChatClose = () => {
    setChatAnchorEl(null);
  };

  const openChat = Boolean(anchorChatEl);
  const idChat = openChat ? 'simple-popover' : undefined;
  //---------------------------------

  let setLogout = () => {
    setShowLogout(true);
    setShowLogoutLoading(false);
  }
  const logout = () => {
    axios.get('api/auth/logout').then(res => {
        store.set("user" , null);
        store.set("token" , null);
        window.location.href = axios.defaults.siteURL + '/signIn';
    }).catch(err => {
        props.history.push(window.dashboard_url + '/account');
    });
  };
  const getLogs = () => {
    axios.get('api/user/logs').then(res => {
      setLogs(res.data)
    }).catch(err => {
      
    });
  };

  React.useEffect(() => {
    if(canManageSite()){
      loadSites();
    }
    getLogs();
  } , [])

  const canManageSite = () => {
    return !!store.get("user").permissions.find(k => k.slug == "site-manage");
  }


  const loadSites = () => {
    axios.get(`api/admin/sites`).then(res => {
        setSites(res.data);
    }).catch(err => {
            
    })
  }

  const applySiteToken = () => {
    axios.defaults.headers.common['site'] = site_token;
    // props.history.replace(window.dashboard_url);
    window.location.reload();
  }


  const getLogo = () => {
    // console.log('store',store.get("user"))
    let site = store.get("user").site.site_settings.find(k => k.slug == "logo");
    if(!site) return logo;
    return axios.defaults.baseURL + site.value;
  }

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar className={classes.dir}>
        
        <RouterLink to="/">
          <Typography component="h2" variant="h2" className={classes.title}>
            <img src={getLogo()} className={classes.logo} alt="" />
          </Typography>
        </RouterLink>
        <div className={classes.flexGrow} />
        
        {canManageSite() ? (
          <Fragment>
            <Button onClick={applySiteToken}>
              Select Site
            </Button>
            <FormControl   className={classes.sites}>
              <InputLabel id="demo-simple-select-outlined-label">Current Site</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={site_token}
                onChange={(e) => {setSiteToken(e.target.value)}}
                label="Current Site"
              >
                {sites.map((k , i) => {
                  return (
                    <MenuItem key={i} value={k.token}>{k.name}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Fragment>

        ) : null}
        <Hidden mdDown>
          <div id="users_noti">
            <IconButton
              className={classes.signOutButton}
              color="inherit"
              onClick={handleClick}
            >
              <Badge badgeContent={logs.join.length} color="secondary">
                <PeopleIcon />
              </Badge>
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <List dense className={classes.maxMenuHeight}>
                {logs.join.map((value , i) => {
                  return (
                    <ListItem key={i} 
                    button
                    component={CustomRouterLink}
                    to={window.dashboard_url + "/reports/users/" + value.id}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={value.avatar ? axios.defaults.baseURL + value.avatar : null}
                        />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={value.name + " " + value.family + " joined "} 
                        secondary={"at " + moment(value.created_at).format("YYYY-MM-DD HH:mm:ss")}
                        />
                    </ListItem>
                  );
                })}
              </List>
            </Popover>
          </div>
        </Hidden>
        <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            // component={CustomRouterLink}
            // to={window.dashboard_url + "/messaging"}
          >
            <Badge badgeContent={logs.chats.length} color="secondary" onClick={handleChatClick}>  
              <MailOutlineIcon />
            </Badge>
          </IconButton>
          {!!logs.chats.length ? (
            <Popover
              id={idChat}
              open={openChat}
              anchorEl={anchorChatEl}
              onClose={handleChatClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <List dense className={classes.maxMenuHeight}>
                {logs.chats.map((value , i) => {
                  return (
                    <ListItem key={i} 
                    button
                    component={CustomRouterLink}
                    to={window.dashboard_url + "/reports/users/" + value.sender_id + "#chat"}
                    >
                      <ListItemText 
                        primary={"New Message from " + value.sender.name + " " + value.sender.family} 
                        // secondary={"at " + moment(value.created_at).format("YYYY-MM-DD HH:mm:ss")}
                        />
                    </ListItem>
                  );
                })}
              </List>
            </Popover>
        
          ) : null}
        </Hidden>
        <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            component={CustomRouterLink}
            to={window.dashboard_url + "/reports/users/#stars"}
          >
            <Badge badgeContent={logs.stars} color="secondary">  
              <StarBorderIcon />
            </Badge>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
          >
             <Badge badgeContent={checkChachedIds('logs' , logs.logs.map(k => k.id)).length} color="secondary" 
              onClick={handleNotiClick}>  
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {!!logs.logs.length ? (
            <Popover
              id={idNoti}
              open={openNoti}
              anchorEl={anchorNotiEl}
              onClose={handleNotiClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <List dense className={classes.maxMenuHeight}>
                {logs.logs.map((value , i) => {
                  return (
                    <ListItem key={i} 
                    button
                    onClick={() => chachedId('logs' , value.id)}
                    component={CustomRouterLink}
                    to={window.dashboard_url + "/reports/users/" + value.user_id}
                    >
                      <ListItemText 
                        primary={value.action} 
                        />
                    </ListItem>
                  );
                })}
              </List>
            </Popover>
        
          ) : null}
          </Hidden>
        {/* <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            component={CustomRouterLink}
            onClick={() => setLogout()}
          >
            <InputIcon />
          </IconButton>
        </Hidden> */}
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Dialog open_dialog={showLogout} 
        msg={Lang.profile.logout} 
        negative_btn={Lang.common.cancel} 
        positive_btn={Lang.common.yes} 
        showLoading={showLogoutLoading}
        on_negative_btn={() => {
          setShowLogout(false);
          setShowLogoutLoading(false);
        }}
        on_positive_btn = {() => {
          setShowLogoutLoading(true);
          logout();
        }}
        />
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default withRouter(Topbar);
