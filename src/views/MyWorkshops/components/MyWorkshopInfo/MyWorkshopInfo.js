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
    Button
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Schedules from "../Schedules";
import axios from "axios";
import Loading from "../../../Loading";
import moment from 'moment';
import Lang from "../../../../Language";
import {withRouter} from  'react-router-dom';
import { NavLink as RouterLink } from 'react-router-dom';
import store from "store";

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
  space : {
      padding: theme.spacing(1)
  },
  formControl : {
      width:"100%",
      marginTop : theme.spacing(1)
  }
}));


const MyWorkshopInfo = (props) => {
  const classes = useStyles();

    const [user_id ] = useState(props.match.params.user_id);
    const [is_renew] = useState(props.match.path.includes("renew"));
    const [myPackage , setMyPackage] = useState(null);
    const [reserve_id] = useState(props.match.params.reserve_id);
    const [schedules , setSchedules] = useState([]);
    const [showLoading , setLoading] = useState(true);
    const [timezone , setTimezone]  = useState([]);
    const [reserve , setReserve ] = useState({});

  React.useEffect(() => {
    if(user_id){
      getUserPackage(user_id , reserve_id);
    }else{
      getMyWorkshop(reserve_id);
    }
    if(is_renew){
      GetTimezone();
    }
  } , [])

  
  const getMyWorkshop = (packageId) => {
    // TODO 'api/user/myPackages/${packageId}' -> FetchSinglePackage
    setLoading(true);
    let url = `api/user/myWorkshops/${packageId}`;
    axios.get(url).then(res => {
      // if(res.data.workshop == null){
      //   props.history.push(window.dashboard_url + "/myworkshops");
      // }else{
        setMyPackage(res.data);
        setSchedules(res.data.workshop.sessions)
        setLoading(false);
      // }
    }).catch(err => {
        // props.history.push(window.dashboard_url + "/myworkshops");
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
        setLoading(false);
    });
  };


  const SaveReserve = () => {
    setLoading(true);
    let data = {
      timezone : reserve.timezone,
      coupon : reserve.coupon
    }
    axios.post(`api/v1.0/reserves/${reserve_id}` , data).then(res => {
        if(res.data.data.reserve.paid == 1){
          props.history.push(window.dashboard_url + "/myPackages");
        }else{
          let token = res.data.data.reserve.reserve_token;
          // if(store.get("user").timezone.toLowerCase().includes("tehran")){
          //   window.location = axios.defaults.baseURL + "/pay/booking/zarrin?reserve_token="+token;
          // }else{
            window.location = axios.defaults.baseURL + "/pay/booking/paypal?reserve_token="+token+'&site_id=7';
          // }
        }
        setLoading(false);
    }).catch(err => {
        setLoading(false);
    });
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
                    <TableCell>{myPackage.workshop.title}</TableCell>
                    <TableCell>{myPackage.workshop.staff.user.name + " " + myPackage.workshop.staff.user.family}</TableCell>
                    <TableCell>{myPackage.workshop.duration } {Lang.my_packages.list.minutes}</TableCell>
                    <TableCell>{myPackage.workshop.sessions.length}</TableCell>
                    {is_renew ? null : (
                      <Fragment>
                        <TableCell>{myPackage.coupon ? myPackage.coupon : "-" }</TableCell>
                        <TableCell>{myPackage.currency == "USD" ? (myPackage.price + " $") : (myPackage.ir_price + " IRT")}</TableCell>
                        <TableCell>{myPackage.timezone}</TableCell>
                      </Fragment>
                    ) }
                    <TableCell>{moment(myPackage.created_at).format("Y-M-D H:m")}</TableCell>
                    
                    <TableCell>{myPackage.paid ? (
                        <Chip label={Lang.my_packages.list.paid} color="primary"/>
                    ) : (
                        <Chip label={Lang.my_packages.list.not_paid} color="secondary"/>
                    )}</TableCell>
                    
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
          <Card className={classes.content}>
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
                                  <TableCell>{Lang.my_packages.list.coupon}</TableCell>
                                  <TableCell>{Lang.my_packages.list.price}</TableCell>
                                  <TableCell>{Lang.my_packages.list.timezone}</TableCell>
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

          <Schedules schedules={schedules} mPackage={myPackage}/>
        </Fragment>
        )}
    </div>
  );
};

export default withRouter(MyWorkshopInfo);
