import React , { useState , Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    TextField,
    Button,
} from '@material-ui/core';
import axios from "axios";
import { withRouter } from "react-router-dom"
import Autocomplete from '@material-ui/lab/Autocomplete';
import Lang from "../../../../../../Language"
import Loading from "../../../../../Loading"
import {Toast } from "../../../../../../config/ToastConfig/Toast.config"
import Validator from "../../../../../../Validator"
import moment from "moment";
import {
    KeyboardDateTimePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
      padding : theme.spacing(3)
  },
  space : {
      padding: theme.spacing(1)
  },
}));

function Book(props) {
    const classes = useStyles();
    const {user_timezone} = props;

    const [ user_id ] = useState(props.match.params.user_id);
    const [ showLoading, setLoadingState] = useState(true);
    const [ packages , setPackages ] = useState([]);
    const [ mpackage , setPackage ] = useState({});
    const [ available , setAvailable ] = useState([]);
    const [ timezone , setTimezone ] = useState([]);
    const [ reserve , setReserve ] = useState({});
    const [ staff_package , setStaffPackage ] = useState(null);
    const [ sessions , setSessions] = useState([1,2,3,4,8,12]);
    const [ showBookLoading , setBookLoadingState ] = useState(false); 

    React.useEffect(( ) => {
        if(user_timezone){
            setReserve({...reserve ,timezone : user_timezone })
        }
    } , [user_timezone])

    React.useEffect(() => {
        getPackages();
        GetTimezone();
    } , [])

    React.useEffect(() => {
        if(staff_package){
            // GetPackage();
        }else{
            setPackage({});
        }
    } , [staff_package])

  const getPackages = () => {
    setLoadingState(true);
    axios.get(`api/v1.0/staffs/getAll`).then(res => {
      setPackages(res.data.data);
      setLoadingState(false);
    }).catch(err => {
        setLoadingState(false);
        Toast(Lang.common.connection_error , "danger")
    })
  }

  
  const GetPackage = () => {
        // TODO 'api/user/myPackages' -> myPackages
        setBookLoadingState(true);
        axios.post(`api/v1.0/staffs/${staff_package.slug}/${staff_package.package.id}`).then(res => {
            setBookLoadingState(false);
            setPackage(res.data.data.package);
            setAvailable(res.data.data.available);
            if(res.data.data.package.type == "single"){
                setSessions([1]);
            }else{
                setSessions([1,2,3,4,8,12]);
            }
        }).catch(err => {
            setBookLoadingState(false);
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
        setLoadingState(true);
        let data = {...reserve};
        data.staff_package_id = staff_package.id;
        data.user_id = user_id;
        axios.post(`api/admin/users/packages/reserve` , data).then(res => {
            setLoadingState(false);
            //users/2/booking
            Toast(Lang.common.success , "success");
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        });
    }


  return (
    <div className={classes.root}>
      {showLoading ? (
          <Loading/>
        ) : (
            <div>
                <Typography variant="h4">
                    Book New Course
                </Typography>
                <Grid 
                container
                >
                    <Grid item xs={12} md={12} className={classes.space}>
                        <FormControl variant="outlined" fullWidth className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Packages</InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            // value={age}
                            onChange={(e) => setStaffPackage(packages.find(k => k.id == e.target.value))}
                            label="Packages"
                            >
                            <MenuItem ></MenuItem>
                            {packages.map((k , i) => {
                                return (
                                <MenuItem value={k.id} key={i}>{k.name + " " + k.family + " - " + k.package.package.name + " - " + k.package.duration + " " + Lang.common.minutes}</MenuItem>
                                )
                            })}
                            </Select>
                            
                        </FormControl>
                    </Grid>
                    {showBookLoading ? (
                        <Grid item xs={12}>
                            <Loading/>
                        </Grid>
                    ) : (!staff_package ? null : (
                        <Fragment>
                            <Grid
                                item
                                md={6}
                                xs={12}
                                className={classes.space}
                            >
                            <FormControl variant="outlined" fullWidth className={classes.formControl}>
                            <KeyboardDateTimePicker 
                                id="start_at-local"
                                label={Lang.workshop.form.start_at}
                                fullWidth
                                required
                                format="yyyy/MM/dd HH:mm"
                                error={Validator.checkInput("schedule_date" , reserve ,"reserve")}
                                className={classes.textField}
                                inputVariant="outlined"
                                value={reserve.schedule_date ? new Date(reserve.schedule_date) : new Date()}
                                onChange={(e)=>setReserve({...reserve ,schedule_date : moment(e).format("YYYY-MM-DD HH:mm") })}
                                />
                                {/* <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                label={Lang.Booking.package.form.schedule_date}
                                name="schedule_date"
                                error = {Validator.checkInput("schedule_date" , reserve , "reserve")}
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
                                </Select> */}
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
                                fullWidth
                                className={classes.formControl}
                                value={timezone.find(k => k.timezone == reserve.timezone)}
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
                                md={6}
                                xs={12}
                            >
                                <TextField 
                                    className={classes.formControl}
                                    id="outlined-basic" 
                                    fullWidth
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
                                md={6}
                                xs={12}
                            >
                                <TextField 
                                    className={classes.formControl}
                                    id="outlined-basic" 
                                    fullWidth
                                    label={Lang.Booking.package.form.schedules_count}
                                    variant="outlined" 
                                    name="coupon"
                                    type="number"
                                    value={reserve.schedules_count}
                                    error = {Validator.checkInput("schedules_count" , reserve , "reserve")}
                                    onChange={(e) => setReserve({...reserve ,schedules_count : e.target.value })}
                                    />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                className={classes.space}
                            >
                                
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        if(Validator.isFormValid("reserve") && reserve.timezone){
                                            SaveReserve();
                                        }
                                    }}
                                >
                                    {Lang.Booking.package.form.submit}
                                </Button>
                            </Grid>
                            
                        </Fragment>
                    ))}
                </Grid>
            </div>
        )}
    </div>
  );
}


export default withRouter(Book);