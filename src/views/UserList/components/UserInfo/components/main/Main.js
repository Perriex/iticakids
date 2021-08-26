import React , { useState , Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Divider,
    Tooltip,
    IconButton,
    Grid,
    Avatar,
} from '@material-ui/core';
import ActiveUserIcon from '@material-ui/icons/AssignmentTurnedIn';
import DeactiveUserIcon from '@material-ui/icons/AssignmentLate';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from "axios";
import { withRouter } from "react-router-dom"
import Lang from "../../../../../../Language"
import Loading from "../../../../../Loading"
import {Toast } from "../../../../../../config/ToastConfig/Toast.config"
import MailIcon from '@material-ui/icons/MailOutlineTwoTone';
import GlobeIcon from '@material-ui/icons/PublicTwoTone';
import PhoneIcon from '@material-ui/icons/Phone';
import Book  from "../book";
import store  from "store";
import Coupons  from "../coupons";
import StaffInfo from "../../../../../StaffList/components/StaffInfo"

const useStyles = makeStyles((theme) => ({
  root: {

  },
  flex : {
      display : "flex"
  },
  ml : {
      marginLeft : "auto"
  },
  dir : {
      direction : Lang.direction
  },
  fixed_dir : {
      direction : Lang.direction == "ltr" ? "rtl" : "ltr"
  },
  space : {
      padding : theme.spacing(1)
  },
  avatar : {
      width : theme.spacing(7),
      height : theme.spacing(7),
  },
  rtl : {
    direction : "rtl"
  },
  ltr : {
    direction : "ltr"
  },
}));

function Main(props) {
  const classes = useStyles();

  // eslint-disable-next-line no-unused-vars

  const [user_id] = useState(props.match.params.user_id);
  const [user, setUserInfo] = useState({});
  const [showLoading, setLoadingState] = useState(true);
  const [ newProfile , setNewProfile ] = useState(false)
  const [ is_staff , setIsStaff ] = useState(false);

  React.useEffect(() => {
    refresh();
  }, []);


  const refresh = () => {
    if(props.match.params.user_id){
        axios.get(`api/admin/users/${props.match.params.user_id}/full`).then(res => {
          setLoadingState(false);
          let user = res.data.data;
          if(user.staff){
            user.staff.json = JSON.parse(user.staff.json);
          }
          setUserInfo(user);
          setIsStaff(!!user.roles.find(k => k.slug == "staff"));
        }).catch(err => {
          setLoadingState(false);
          Toast(Lang.common.connection_error , "danger");
        });
      }else{
        setNewProfile(true);
        setLoadingState(false);
        setUserInfo({id : null});
        setUserInfo({id : null});
      }
  }

  const loginUser = () => {
    setLoadingState(true);
    let url = `api/admin/users/${user_id}/login`;
    axios.get(url).then(res => {
      store.set("user" , res.data.data.user);
      store.set("token" , "Bearer " + res.data.data.token);
      window.location.href = window.dashboard_url + "/account";
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");

    })
  }


  const activateUser = (activate) => {
    // TODO 'api/admin/users/activate' -> activateUser
    setLoadingState(true);
    let data = {user_id: user_id, active: (activate ? 1 : 0)};
    axios.post('api/admin/users/activate', data).then(res => {
        refresh();
      Toast(Lang.common.success , "success");
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    });
  };


  const deleteUser = () => {
    setLoadingState(true);
    axios.get(`api/admin/users/${user_id}/delete`).then(res => {
      Toast(Lang.common.success , "success");
      props.history.replace(window.dashboard_url + "/users");
      // setLoadingState(false);
    }).catch(err => {

      Toast(Lang.common.connection_error , "danger");
      // setLoadingState(false);
    });
  }

  return (
    <div className={classes.root}>
      {showLoading ? (
          <Loading/>
      ) : (
        <div>
            <div className={classes.flex}>
                <div>
                    <Tooltip title="Delete User">
                        <IconButton onClick={deleteUser} color={"secondary"}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="User's Active State">
                        <IconButton onClick={() => activateUser(!(user.is_active == 1))} color={user.is_active == 1 ? "primary" : "secondary" }>
                            {user.is_active == 1 ? (
                                <ActiveUserIcon/>
                            ) : (
                                <DeactiveUserIcon/>
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Loin As This User">
                        <IconButton color={"danger"} onClick={loginUser}>
                            <ExitToAppIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.ml}>
                    <Grid container className={classes.dir}>
                        <Grid item className={classes.space}>
                            <Avatar alt="Remy Sharp" src={user.avatar} className={classes.avatar} />
                        </Grid>
                        <Grid item className={classes.space}>
                            <Typography variant="h4">
                                {user.name} {user.family}
                            </Typography>
                            <Typography variant="h6" className={classes.fixed_dir}>
                                {user.email}
                                <MailIcon/>
                            </Typography>
                            {user.country ? (
                                <Typography variant="h6"  className={classes.fixed_dir}>
                                    {user.country}
                                    <GlobeIcon/>
                                </Typography>
                            ) : null}
                            {user.phone_number ? (
                                <Typography variant="h6"  className={classes.fixed_dir}>
                                    {user.phone_number}
                                    <PhoneIcon/>
                                </Typography>
                            ) : null}
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Divider/>
            {is_staff ? (
              <StaffInfo isProfile={true} showInfo={false}/>
            ) : (
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Book user_timezone={user.timezone}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Coupons/>
                </Grid>
              </Grid>
            )}
            
        </div>
      )}
    </div>
  );
}


export default withRouter(Main);
