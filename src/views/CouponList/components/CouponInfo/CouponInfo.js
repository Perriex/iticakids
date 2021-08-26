import React , {useState, Fragment} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Card,CardContent , Divider , Grid , Typography , Avatar} from '@material-ui/core';
import {
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import SaveIcon from "@material-ui/icons/Save"
import { makeStyles } from '@material-ui/styles';
import UserPicker from "../UserPicker";
import StaffPicker from "../StaffPicker";
import moment from "moment";
import axios from "axios";
import {withRouter} from  'react-router-dom';
import Loading from "../../../Loading";
import Lang from "../../../../Language";
import Validator from "../../../../Validator";
import {Toast} from '../../../../config/ToastConfig/Toast.config';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    grid:{
        padding: theme.spacing(1)
    },
    input:{
        width:"100%"
    },
    marginTop : {
        marginTop: theme.spacing(1)
    },
    marginLeft : {
        marginLeft: theme.spacing(1)
    },
    flex: {
        display: "flex",
        alignItems : "center"
    }
  }));


const CouponInfo = props => {

    const classes = useStyles();
    
    const { openDialog , onDialogClosed, current_package} = props;

    const [coupon_id , setCouponId] = useState(props.match.params.coupon_id);
    const [coupon , setCoupon] = useState({})

    const [user , setUser ] = useState(coupon && coupon.user ? coupon.user : {});
    const [staff , setStaff ] = useState(coupon && coupon.staff ? coupon.staff : {});
    
    const [userPicker , setUserPicker] = useState(false);
    const [staffPicker , setStaffPicker] = useState(false);
    const [showLoading , setLoading] = useState(false);

    React.useEffect(() => {
        if(coupon_id != "new"){
            getSpecificCouponInfo(coupon_id)
        }
    } ,[]);

    
    const getSpecificCouponInfo = (coupon_id) => {
        setLoading(true);
        // TODO `api/admin/coupons/{COUPON_ID}` -> getSpecificCouponInfo
        axios.get(`api/admin/coupons/${coupon_id}`)
        .then(res => {
            setLoading(false);
            setCoupon(res.data.data);
            setStaff(res.data.data.staff);
            setUser(res.data.data.user);
        })
        .catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoading(false);
        });
    };
    
    const checkSchedule = () => {
        if(isNaN(coupon.min_schedules) && isNaN(coupon.max_schedules)){
            return true;
        }
        if(isNaN(coupon.min_schedules) || isNaN(coupon.max_schedules)){
            return false;
        }

        if(coupon.min_schedules > coupon.max_schedules){
            return false;
        }

        return true;

    }

    const checkValidationDate = () => {
        if(!coupon.start_validation && !coupon.start_validation){
            return true;
        }
        if(!coupon.start_validation || !coupon.start_validation){
            return false;
        }
        let start = moment(coupon.start_validation).format("X");
        let end = moment(coupon.end_validation).format("X");
        if(start > end){
            return false;
        }
        return true;
    }
    
  const couponUpdateInfo = () => {
    // TODO 'api/admin/coupons/{COUPON_ID}' -> couponUpdateInfo
    let data = {...coupon};
    if(data.start_validation){
        data.start_validation = moment(data.start_validation).format("Y-M-D");
    }
    if(data.end_validation){
        data.end_validation = moment(data.end_validation).format("Y-M-D");
    }
    setLoading(true);
    axios.post(`api/admin/coupons/${coupon_id}`, data)
      .then(res => {
        Toast(Lang.common.success , "success");
          setLoading(false);
      })
      .catch(err => {
        Toast(Lang.common.connection_error , "danger");
        setLoading(false);
      });
  };


    const onUserPick = user =>{
        setUser(user);
        setCoupon({...coupon , user_id : user.id})
    }

    const onStaffPick = staff =>{
        setStaff(staff);
        setCoupon({...coupon , staff_id : staff.staff.id})
    }

    const saveCoupon = () => {
        if(coupon_id != "new"){
            couponUpdateInfo();
        }else{
            defineNewCoupon();
        }
    }


    
  const defineNewCoupon = () => {
    // TODO 'api/admin/coupons' -> defineNewCoupon
    let data = {...coupon};
    if(data.start_validation){
        data.start_validation = moment(data.start_validation).format("Y-M-D");
    }
    if(data.end_validation){
        data.end_validation = moment(data.end_validation).format("Y-M-D");
    }
    setLoading(true);
    axios.post('api/admin/coupons', data)
      .then(res => {
        setLoading(false);
        Toast(Lang.common.success , "success");
        props.history.push(window.dashboard_url + '/coupons')
      })
      .catch(err => {
        Toast(Lang.common.connection_error , "danger");
        setLoading(false);
      });
  };

    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading />
            ) : (
                <Fragment>
                <Card className={classes.marginTop}>
                        <CardContent>
                            <Typography className={classes.grid} component="h5" variant="h5">
                                {Lang.coupon.list.form.title}
                            </Typography>
                            <Divider ligth="true" />
                            <Grid
                            container
                            >
                            <Grid
                            item
                            className={classes.grid}
                            md={4}
                            xs={12}
                            >
                                <TextField 
                                className={classes.input}
                                label= {Lang.coupon.list.form.code}
                                variant="outlined"
                                type="text"
                                value={coupon.code}
                                required
                                error={Validator.checkInput("code" , coupon)}
                                onChange={(e)=>setCoupon({...coupon , code : e.target.value})}
                                />
                            </Grid>
    
                            <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    <TextField 
                                    className={classes.input}
                                    label={Lang.coupon.list.form.percent}
                                    variant="outlined"
                                    type="number"
                                    required
                                    error={Validator.checkInput("percentage" , coupon)}
                                    value={coupon.percentage}
                                    onChange={(e)=>setCoupon({...coupon , percentage : e.target.value})}
                                    />
                                </Grid>
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    <TextField 
                                    className={classes.input}
                                    label={Lang.coupon.list.form.usage}
                                    variant="outlined"
                                    type="number"
                                    required
                                    error={Validator.checkInput("usage" , coupon)}
                                    value={coupon.usage}
                                    onChange={(e)=>setCoupon({...coupon , usage : e.target.value})}
                                    />
                                </Grid>
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    <TextField 
                                    className={classes.input}
                                    label={Lang.coupon.list.form.min_schedule}
                                    variant="outlined"
                                    type="number"
                                    value={coupon.min_schedules}
                                    onChange={(e)=>setCoupon({...coupon , min_schedules : e.target.value})}
                                    />
                                </Grid>
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    <TextField 
                                    className={classes.input}
                                    label={Lang.coupon.list.form.max_schedule}
                                    variant="outlined"
                                    type="number"
                                    value={coupon.max_schedules}
                                    onChange={(e)=>setCoupon({...coupon , max_schedules : e.target.value})}
                                    />
                                </Grid>
                                
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    {coupon.user_id ? (
                                        <div className={classes.flex}
                                        onClick={()=>setUserPicker(!userPicker)}
                                        >
                                            <Typography variant="body1">{Lang.coupon.list.form.for_user} </Typography>
                                            <div className={classes.marginLeft}>
                                                <Avatar
                                                className={classes.avatar}
                                                src={user.avatar ? axios.defaults.baseURL + user.avatar : null}
                                                >
                                                {user.name}
                                                </Avatar>
                                                <Typography variant="body1">{user.name}</Typography>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={()=>setUserPicker(!userPicker)}
                                            color="primary"
                                            variant="contained"
                                        >
                                            {Lang.coupon.list.form.select_user}
                                        </Button>
                                    )}
                                    
                                </Grid>
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    
                                    <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label={Lang.coupon.list.form.start_validation}
                                    format="dd/MM/yyyy"
                                    value={coupon.start_validation}
                                    onChange={(date)=>setCoupon({...coupon , start_validation : date})}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    />
                                </Grid>
    
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    
                                    <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label={Lang.coupon.list.form.end_validation}
                                    format="dd/MM/yyyy"
                                    value={coupon.end_validation}
                                    onChange={(date)=>setCoupon({...coupon , end_validation : date})}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    />
                                </Grid>
    
                                <Grid
                                item
                                className={classes.grid}
                                md={4}
                                xs={12}
                                >
                                    {coupon.staff_id ? (
                                        <div className={classes.flex}
                                        onClick={()=>setStaffPicker(!staffPicker)}
                                        >
                                            <Typography variant="body1">{Lang.coupon.list.form.for_staff} </Typography>
                                            <div className={classes.marginLeft}>
                                                <Avatar
                                                className={classes.avatar}
                                                src={staff.avatar ? axios.defaults.baseURL + staff.avatar : null}
                                                >
                                                {staff.name}
                                                </Avatar>
                                                <Typography variant="body1">{staff.name}</Typography>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={()=>setStaffPicker(!staffPicker)}
                                            color="primary"
                                            variant="contained"
                                        >
                                            {Lang.coupon.list.form.select_staff}
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                            <Button
                                color="primary"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={() => {
                                    if(!checkSchedule()){
                                        Toast("بازه تعداد جلسات صحیح نیست!" , "error");
                                        return;
                                    }
                                    if(!checkValidationDate()){
                                        Toast("بازه تاریخ اعتبار صحیح نیست!","error");
                                        return;
                                    }
                                    if(Validator.isFormValid() && checkSchedule() && checkValidationDate()){
                                        saveCoupon();
                                    }
                                }}
                            >
                                {Lang.common.save}
                            </Button>
                        </CardContent>
                    </Card>
                    
                    <div className={classes.marginTop}>
                        {userPicker ? (
                            <UserPicker onUserPick={onUserPick}/>
                        ) : null}
                    </div>
                    
                    <div className={classes.marginTop}>
                        {staffPicker ? (
                            <StaffPicker onStaffPick={onStaffPick}/>
                        ) : null}
                    </div>
               </Fragment>
            
            )}
        </div>
    );
};


export default withRouter(CouponInfo);
