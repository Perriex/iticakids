import React , {forwardRef , useState} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { 
    Button , 
    Grid , 
    Card , 
    CardContent , 
    Typography , 
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@material-ui/core';
import {withRouter} from  'react-router-dom';
import Loading from "../../../../../Loading";
import axios from "axios";
import Validator from "../../../../../../Validator";
import store from "store";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
  root: {
      margin: theme.spacing(3)
  },
  rootRight: {
      paddingRight: theme.spacing(3)
  },
  space : {
      padding: theme.spacing(1)
  },
  avatar:{
      width:120,
      height:120
  },
  avatarContainer:{
      display:"flex",
      justifyContent:"center"
  },
  formControl : {
      width:"100%",
      marginTop : theme.spacing(1)
  }
}));

const BookPackage = props => {
    const { ...rest } = props;

    const [staff_slug] = useState(props.match.params.staff_slug);
    const [package_id] = useState(props.match.params.package_id);
    const [user_id] = useState(props.match.params.user_id);
    const [mPackage , setPackage] = useState({package:{} , staff : {user:{}}});
    const [available , setAvailable] = useState({});
    const [template , setTemplate] = useState({});
    const [showLoading , setLoading] = useState(true);
    const [timezone , setTimezone]  = useState([]);
    const [default_timezone , setDefaultTimezone] = useState("");
    const [user] = useState(store.get("user"));
    const [reserve , setReserve ] = useState({});
    const [sessions , setSessions] = useState([1,2,3,4,8,12]);

    React.useEffect(() => {
        GetPackage(staff_slug , package_id);
        GetTimezone();
        setReserve({...reserve , timezone : user.timezone})
        setDefaultTimezone(user.timezone);
    } , [])


    const GetPackage = (staff_slug , package_id) => {
        // TODO 'api/user/myPackages' -> myPackages
        axios.post(`api/v1.0/staffs/${staff_slug}/${package_id}`).then(res => {
            setLoading(false);
            setPackage(res.data.data.package);
            setAvailable(res.data.data.available);
            setTemplate(res.data.data.template);
            if(res.data.data.package.type == "single"){
                setSessions([1]);
            }
        }).catch(err => {
            setLoading(false);
            Toast(Lang.common.connection_error , "danger");
        });
    };

    const GetTimezone = (staff_slug , package_id) => {
        // TODO 'api/user/myPackages' -> myPackages
        axios.get(`api/timezones`).then(res => {
            setTimezone(res.data);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
        });
    };

    const getAvailableList = () => {
        let list = [];
        for (var key in available) {
            if (available.hasOwnProperty(key)) {
              //key = date
              available[key].map(k => {
                list.push(key + " " + k);
              });
            }
          }
        return list;
    }


    const SaveReserve = () => {
        setLoading(true);
        let data = {...reserve};
        data.staff_package_id = package_id;
        data.user_id = user_id;
        axios.post(`api/v1.0/reserves` , data).then(res => {
            setLoading(false);
            //users/2/booking
            Toast(Lang.common.success , "success");
            props.history.push(window.dashboard_url + '/reports/users/' + user_id + "/booking");
        }).catch(err => {
            setLoading(false);
            Toast(Lang.common.connection_error , "danger");
        });
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading/>
            ) : (
                <Card className={classes.root}>
                <CardContent>
                <Grid
                    container
                >
                    <Grid
                        item
                        className={classes.rootRight}
                        md={6}
                        xs={12}
                    >
                       
                        <Typography component="h5" variant="h5" className={classes.space}>
                            {Lang.Booking.package.title}
                        </Typography>
                        <Grid
                            container
                            className={classes.space}
                        >
                            <Grid
                                item
                                md={4}
                                xs={12}
                                className={classes.avatarContainer}
                            >
                                <Avatar
                                    className={classes.avatar}
                                    src={mPackage.package.image ? axios.defaults.baseURL + mPackage.package.image : null}
                                    >
                                        {mPackage.package.name}
                                </Avatar>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                            >
                                <Typography component="h6" variant="h6" className={classes.space}>
                                {Lang.Booking.package.name} : {mPackage.package.name}
                                </Typography>
                                <Typography component="h6" variant="h6" className={classes.space}>
                                {Lang.Booking.package.staff} : {mPackage.staff.user.name + " " + mPackage.staff.user.family  }
                                </Typography>
                                <Typography component="h6" variant="h6" className={classes.space}>
                                {Lang.Booking.package.duration} : {mPackage.duration}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <Grid 
                        container
                        >
                            <Grid
                                item
                                md={6}
                                xs={12}
                                className={classes.space}
                            >
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">{Lang.Booking.package.form.schedule_date}</InputLabel>
                                <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                label={Lang.Booking.package.form.schedule_date}
                                name="schedule_date"
                                error = {Validator.checkInput("schedule_date" , reserve)}
                                value={reserve.schedule_date}
                                onChange={(e) => setReserve({...reserve ,schedule_date : e.target.value })}
                                >
                                <MenuItem value="">
                                </MenuItem>
                                {getAvailableList().map(k => {
                                    return (
                                        <MenuItem value={k}>{k}</MenuItem>
                                    )
                                })}
                                </Select>
                            </FormControl>

                            </Grid>
                            <Grid
                                item
                                md={6}
                                xs={12}
                                className={classes.space}
                            >
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
                                renderInput={(params) => <TextField {...params} label={Lang.Booking.package.form.timezone}  variant="outlined" />}
                                />
                            </Grid>
                            <Grid
                                item
                                className={classes.space}
                                md={12}
                                xs={12}
                            >
                                <TextField 
                                    className={classes.formControl}
                                    id="outlined-basic" 
                                    label={Lang.Booking.package.form.coupon}
                                    variant="outlined" 
                                    name="coupon"
                                    value={reserve.coupon}
                                    onChange={(e) => setReserve({...reserve ,coupon : e.target.value })}
                                    />
                            </Grid>
                            <Grid
                                item
                                className={classes.space}
                                md={12}
                                xs={12}
                            >
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">{Lang.Booking.package.form.schedules_count}</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label={Lang.Booking.package.form.schedules_count}
                                    name="schedules_count"
                                    value={reserve.schedules_count}
                                    error = {Validator.checkInput("schedules_count" , reserve)}
                                    onChange={(e) => setReserve({...reserve ,schedules_count : e.target.value })}
                                    >
                                    <MenuItem value="">
                                    </MenuItem>
                                    {sessions.map(k => {
                                        return (
                                            <MenuItem value={k}>{k}</MenuItem>
                                        )
                                    })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                className={classes.space}
                            >
                                
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        if(Validator.isFormValid() && reserve.timezone){
                                            SaveReserve();
                                        }
                                    }}
                                >
                                    {Lang.Booking.package.form.submit}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
            )}
        </div>
    );
};

export default withRouter(BookPackage);
