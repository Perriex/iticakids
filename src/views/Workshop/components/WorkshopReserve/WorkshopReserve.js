import React , { useState , Fragment} from "react";
import UserPicker from "../../../CouponList/components/UserPicker"
import {  makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Paper,
    TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Lang from "../../../../Language"
import Loading from "../../../Loading"
import { Toast } from "../../../../config/ToastConfig/Toast.config"
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
      padding : theme.spacing(3)
    },
    marginBottom : {
        marginBottom : theme.spacing(3)
    },
    space : {
        padding : theme.spacing(1)
    }
  }));
  
const WorkshopReserve = (props) => {
    const classes = useStyles();
    const [ workshop_slug ] = useState(props.match.params.workshop_slug);
    const [ user , setUser ] = useState({});
    const [timezones , setTimezones ] = useState([]);
    const [timezone , setTimezone ] = useState();
    const [coupon , setCoupon ] = useState();
    const [showLoading , setLoadingState ] = useState(false);
    
    React.useEffect(() => {
        loadTimezones();
    } , [])

    const onUserPick = (user) => {
        setUser(user && user.id ? user : {})
    }

    const loadTimezones = () => {
        axios.get('api/timezones').then(res => {
            setTimezones(res.data);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
        })
    }

    const saveWorkshop = () => {
        if(!user.id){
            Toast(Lang.workshop.reserve.error_user, "danger");
            return;
        }
        if(!timezone){
            Toast(Lang.workshop.reserve.error_timezone , "danger");
            return;
        }

        setLoadingState(true);
        let data = {
            timezone : timezone,
            coupon : coupon,
            user_id : user.id
        };

        axios.post(`api/v1.0/workshops/${workshop_slug}/reserve` , data).then(res =>{

            Toast(Lang.common.success , "success");
            props.history.replace(window.dashboard_url + `/workshops/${workshop_slug}/reserves`);
            setLoadingState(false);
        }).catch(err => {

            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        })

    }

    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading />
            ) : (
                <Fragment>
                    <Paper className={clsx(classes.root , classes.marginBottom)}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            {user.id ? (
                                <ListItem>
                                    <ListItemText primary={user.name + " " + user.family} />
                                    <ListItemAvatar>
                                    <Avatar
                                        src={user.avatar ? axios.defaults.baseURL + user.avatar : null}
                                    />
                                    </ListItemAvatar>
                                </ListItem>
                            ) : (
                                <p>
                                    {Lang.workshop.reserve.user_not_selected}
                                </p>
                            )}
                        </Grid>
                        <Grid item xs={12} md={2} className={classes.space}>
                        <Autocomplete
                            id="combo-box-demo"
                            fullWidth
                            options={timezones}
                            getOptionLabel={(option) => option.timezone}
                            renderInput={(params) => <TextField {...params} label={Lang.workshop.reserve.timezone} variant="outlined" />}
                            onChange={(event, newValue) => {
                                setTimezone( newValue ? newValue.timezone : null)
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2} className={classes.space}>
                            <TextField
                                id="outlined-helperText"
                                label={Lang.workshop.reserve.coupon}
                                value={coupon}
                                variant="outlined"
                                onChange={(e) => setCoupon(e.target.value)}
                                />
                        </Grid>
                        <Grid item xs={12} md={2} className={classes.space}>
                            <Button variant="contained" onClick={saveWorkshop} color="primary">
                                {Lang.common.save}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <UserPicker onUserPick={onUserPick}/>
            
                </Fragment>
            )}
        </div>
    )
}


export default withRouter(WorkshopReserve);