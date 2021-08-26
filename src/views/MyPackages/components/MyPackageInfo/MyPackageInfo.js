import React, { useState , Fragment ,forwardRef} from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
    Grid, 
    Typography, 
    Card, 
    CardContent ,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    TextField,
    Button,
    Paper,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Schedules from "../Schedules";
import axios from "axios";
import Loading from "../../../Loading";
import moment from 'moment';
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import {withRouter} from  'react-router-dom';
import { NavLink as RouterLink } from 'react-router-dom';
import store from "store";
import clsx from 'clsx';
import ScheduleDatePicker from "../ScheduleDatePicker";
import { useRef } from 'react';

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));
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
  },
  picker : {
    minWidth : "250px"
  } ,
  dir : {
    direction : "rtl"
  },
  button : {
    marginTop : theme.spacing(1),
    marginLeft : theme.spacing(1),
  },
  flex :{
    display : "flex"
  },
  ml : {
    marginLeft : "auto"
  },
  space : {
      padding: theme.spacing(1)
  },
  formControl : {
      width:"100%",
      marginTop : theme.spacing(1)
  },
  marginBottom : {
    marginBottom : theme.spacing(3)
  }
}));


const MyPackageInfo = (props) => {
  const classes = useStyles();

  const myRef = useRef(null)

  const [user_id ] = useState(props.match.params.user_id);
  const [is_renew] = useState(props.match.path.includes("renew"));
  const [myPackage , setMyPackage] = useState(null);
  const [reserve_id] = useState(props.match.params.reserve_id);
  const [schedules , setSchedules] = useState([]);
  const [reschedules , setReschedules] = useState(null);
  const [showLoading , setLoading] = useState(true);
  const [timezone , setTimezone]  = useState([]);
  const [reserve , setReserve ] = useState({});
  React.useEffect(() => {
    refresh();
  } , [])

  // React.useEffect(() => {
  //   if(canUserManage() && myPackage){
  //     getTimes();
  //   }
  // } , [myPackage])

  const refresh = () => {
    if(user_id){
      getUserPackage(user_id , reserve_id);
    }else{
      getMyPackage(reserve_id);
    }
    if(is_renew){
      GetTimezone();
    }
  }

  const getMyPackage = (packageId) => {
    // TODO 'api/user/myPackages/${packageId}' -> FetchSinglePackage
    setLoading(true);
    let url = `api/user/myPackages/${packageId}`;
    if(is_renew){
      url = `api/v1.0/reserves/${reserve_id}`;
    }
    axios.get(url).then(res => {
      if(res.data.data.package == null){
        props.history.push(window.dashboard_url + "/myPackages");
      }else{
        setMyPackage(res.data.data.package);
        setSchedules(res.data.data.schedules)
        setLoading(false);
      }
    }).catch(err => {
        props.history.push(window.dashboard_url + "/myPackages");
        Toast(Lang.common.connection_error , "danger");
        setLoading(false);
    });
  };
  
  const getUserPackage = (user_id, packageId) => {
    setLoading(true);
    let data = {
      user_id : user_id
    }
    axios.post(`api/admin/users/packages/${packageId}` , data).then(res => {
      if(res.data.data.package == null){
        props.history.push(window.dashboard_url + "/users/"+user_id+"/booking");
      }else{
        setMyPackage(res.data.data.package);
        setSchedules(res.data.data.schedules)
        setLoading(false);
      }
    }).catch(err => {
        props.history.push(window.dashboard_url + "/users/"+user_id+"/booking");
        Toast(Lang.common.connection_error , "danger");
        setLoading(false);
    });
  };

  const getTime = (date , timezone) => {
    if(timezone){
      return moment.utc(date).tz(timezone ).format("Y-M-D H:mm");
    }
    return moment(date).format("Y-M-D H:mm");
  }


  const SaveReserve = () => {
    setLoading(true);
    let data = {
      timezone : reserve.timezone,
      coupon : reserve.coupon
    }
    axios.post(`api/v1.0/reserves/${reserve_id}` , data).then(res => {
        if(parseInt(res.data.data.reserve.paid) == 1){
          props.history.push(window.dashboard_url + "/myPackages");
        }else{
          let token = res.data.data.reserve.reserve_token;
          // if(store.get("user").timezone.toLowerCase().includes("tehran")){
          //   window.location = axios.defaults.baseURL + "/pay/booking/zarrin?reserve_token="+token;
          // }else{
            window.location = axios.defaults.baseURL + "/pay/booking/paypal?reserve_token="+token;
          // }
        }
        Toast(Lang.common.success , "success");
        setLoading(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
        setLoading(false);
    });
  }

  const onReschedule = (schedule) => {
    setReschedules(schedule);
  }

  React.useEffect(() => {
    if(reschedules && myRef.current){
      myRef.current.scrollIntoView();
    }
  })

  const setRescheduleInfo = (date) =>{
    let data = {
      schedule_id : reschedules.id,
      reserve_id : reschedules.reserve_id,
      schedule_date : date.schedule_date
    };

    setLoading(true);
    axios.post(`api/user/reschedule` , data).then(res => {
      refresh();
      setReschedules(null);
      setLoading(false);
      Toast(Lang.common.success, "success");
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoading(false);
    })
  }

  const getPackageRow = () => {
      return (
          
        <TableRow
                className={classes.tableRow}
                hover
                key={myPackage.id}
            >
            {!myPackage ? null : (
                <Fragment>
                    <TableCell>{myPackage.staff_package.package.name}</TableCell>
                    <TableCell>{myPackage.staff_package.staff.user.name + " " + myPackage.staff_package.staff.user.family}</TableCell>
                    <TableCell>{myPackage.staff_package.duration } {Lang.my_packages.list.minutes}</TableCell>
                    <TableCell>{myPackage.schedules_count}</TableCell>
                    {is_renew ? null : (
                      <Fragment>
                        <TableCell>{myPackage.coupon ? myPackage.coupon : "-" }</TableCell>
                        <TableCell>{myPackage.price} $</TableCell>
                        {/* <TableCell>{myPackage.ir_price} IRT</TableCell> */}
                        <TableCell>{myPackage.timezone}</TableCell>
                      </Fragment>
                    ) }
                    <TableCell>{moment(myPackage.created_at).format("Y-M-D H:m")}</TableCell>
                    
                    <TableCell>{parseInt(myPackage.paid) == 1 ? (
                        <Chip label={Lang.my_packages.list.paid} color="primary"/>
                    ) : (
                        <Chip label={Lang.my_packages.list.not_paid} color="secondary"/>
                    )}</TableCell>
                    
                    {myPackage.renew_reserve_id ? (
                      <TableCell>
                        {user_id ? null : (
                           <Button
                           variant="contained"
                           color="primary"
                           className={classes.button}
                           component={CustomRouterLink}
                           // onClick={() => onUserClick(user)}
                           to={window.dashboard_url + "/myPackages/renew/"+myPackage.renew_reserve_id}
                         >
                           {Lang.my_packages.list.renew}
                       </Button>
                        )}
                      </TableCell>
                    ) : null}
                </Fragment>
            )}      
        </TableRow>
      )
  }
  
  

  const GetTimezone = (staff_slug , package_id) => {
    // TODO 'api/user/myPackages' -> myPackages
    axios.get(`api/timezones`).then(res => {
    setTimezone(res.data);
    }).catch(err => {
    });
};

const canUserManage = () => {
  let permission = store.get("user").permissions.find(k => k.slug == "user-manage");
  return !!permission;
}

const addNewSchedule = (newSchedule) => {
 
  let data = {...newSchedule};
  data.user_id = user_id;
  data.timezone = myPackage.timezone;
  data.staff_package_id = myPackage.staff_package_id;
  setLoading(true);
  axios.post(`api/admin/users/packages/${myPackage.id}/add_schedule` ,data ).then(res => {
    refresh();
    setLoading(false);
    Toast(Lang.common.success , "success");
  }).catch(err => {
    Toast(Lang.common.connection_error , "danger");
    setLoading(false);
  })
}

  return (
    <div className={classes.root}>
    {showLoading ? (
                <Loading/>
            ) : (
        <Fragment>
          
          {is_renew ? (
            <Card className={classes.content}>
              <CardContent>
                <Typography component="h5" variant="h5">
                  {Lang.renew.title}
                </Typography>
                <Grid container>
                  <Grid item md={6} xs={12} className={classes.space}>
                  <Autocomplete
                          id="combo-box-demo"
                          options={timezone}
                          className={classes.formControl}
                          getOptionLabel={(option) => option.timezone}
                          style={{ width: "100%" }}
                          onChange={(event, newValue) => {
                              if(newValue){
                                  setReserve({...reserve ,timezone : newValue.timezone })
                              }
                          }}
                          renderInput={(params) => <TextField {...params} label={Lang.renew.form.timezone}  variant="outlined" />}
                          />
                  </Grid>
                  <Grid item md={6} xs={12} className={classes.space}>
                    <TextField 
                      className={classes.formControl}
                      id="outlined-basic" 
                      label={Lang.renew.form.coupon}
                      variant="outlined" 
                      name="coupon"
                      value={reserve.coupon}
                      onChange={(e) => setReserve({...reserve ,coupon : e.target.value })}
                      />
                  </Grid>
                  <Grid item xs={12} className={classes.space}>

                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            if(reserve.timezone){
                                SaveReserve();
                            }
                        }}
                    >
                        {Lang.renew.form.renew}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          ) : null}
          <Card className={clsx(classes.content, classes.marginBottom)}>
                <CardContent>
                    <Typography component="h5" variant="h5" >
                    {Lang.my_packages.package.detail.title}
                    </Typography>
                    <div className={classes.content}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                  <TableCell>{Lang.my_packages.list.package}</TableCell>
                                  <TableCell>{Lang.my_packages.list.instructor}</TableCell>
                                  <TableCell>{Lang.my_packages.list.dur}</TableCell>
                                  <TableCell>{Lang.my_packages.list.schedules}</TableCell>
                                  {is_renew ? null : (
                                    <Fragment>
                                      <TableCell>{Lang.my_packages.list.coupon}</TableCell>
                                      <TableCell>{Lang.my_packages.list.price}</TableCell>
                                      {/* <TableCell>{Lang.my_packages.list.ir_price}</TableCell> */}
                                      <TableCell>{Lang.my_packages.list.timezone}</TableCell>
                                    </Fragment>
                                  )}
                                  <TableCell>{Lang.my_packages.list.date_ordered}</TableCell>
                                  <TableCell>{Lang.my_packages.list.pay_state}</TableCell>
                                  {myPackage.renew_reserve_id ? (
                                    <TableCell></TableCell>
                                  ) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {getPackageRow()}
                            </TableBody>
                            </Table>
                    </div>
                </CardContent>
            
          </Card>
          {canUserManage() && user_id ? (
            <Paper className={clsx(classes.root , classes.marginBottom)}>
              <ScheduleDatePicker title={Lang.my_packages.package.schedules.new_schedule} myPackage={myPackage} reserve={reserve}  onSave={addNewSchedule}/>
            </Paper>
          ) : null}
          {reschedules ? (
            <Paper ref={myRef} className={clsx(classes.root , classes.marginBottom)}>
              <ScheduleDatePicker title={Lang.my_packages.package.schedules.reschedule + getTime(reschedules.date , myPackage.timezone)} myPackage={myPackage} reserve={reserve}  onSave={setRescheduleInfo}/>
            </Paper>
          ) : null}
          <Schedules schedules={schedules} onReschedule={onReschedule} refresh={refresh} mPackage={myPackage}/>
        </Fragment>
        )}
    </div>
  );
};

export default withRouter(MyPackageInfo);

