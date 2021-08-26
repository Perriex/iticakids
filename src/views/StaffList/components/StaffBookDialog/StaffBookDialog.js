import React , { useState , Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import {
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import Validator from "../../../../Validator"
import Lang from "../../../../Language"
import { Toast } from "../../../../config/ToastConfig/Toast.config"
import Loading from "../../../Loading";
import axios from "axios"
import moment from "moment";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


const useStyles = makeStyles((theme) => ({
    root: {
        padding : theme.spacing(3)
    },
    space : {
        marginTop: theme.spacing(2)
    },
  }));

export default function CustomizedDialogs(props) {
    
    const classes = useStyles();

    const { openDialog  , user_id , start , onClose} = props; 
    const [open, setOpen] = React.useState(false);
    const [ packages , setPackages ] = useState([]);
    const [ timezone , setTimezone ] = useState([]);
    const [ showLoading, setLoadingState] = useState(true);
    const [ reserve , setReserve ] = useState({});
    const [ staff_package , setStaffPackage ] = useState(null);
    const [sessions , setSessions] = useState([1,2,3,4,8,12]);
    const [ showBookLoading , setBookLoadingState ] = useState(false); 

    React.useEffect(() => {
        setOpen(openDialog)
    } , [openDialog])

    React.useEffect(() => {
        setReserve({...reserve , schedule_date : start });
    } , [start])

    React.useEffect(() => {
        getPackages();
        GetTimezone();
    } , [])

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
    
  
      
      
    const GetTimezone = (staff_slug , package_id) => {
        // TODO 'api/user/myPackages' -> myPackages
        axios.get(`api/timezones`).then(res => {
            setTimezone(res.data);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
        });
    };

    const handleClose = () => {
        // setOpen(false);
        onClose();
    };


    const SaveReserve = () => {
        setLoadingState(true);
        let data = {...reserve};
        data.staff_package_id = staff_package.id;
        data.user_id = user_id;
        axios.post(`api/admin/users/packages/reserve` , data).then(res => {
            setLoadingState(false);
            //users/2/booking
            Toast(Lang.common.success , "success");
            handleClose();
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        });
    }

    return (
        <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog}>

            <DialogContent dividers>
               {showLoading ? (
                   <Loading/>
               ) : (
                   <Fragment>
                        <FormControl variant="outlined" fullWidth className={classes.space}>
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
                        <FormControl variant="outlined" fullWidth className={classes.space}>
                            <TextField
                                id="start_at-local"
                                label={Lang.workshop.form.start_at}
                                fullWidth
                                type="datetime-local"
                                required
                                error={Validator.checkInput("schedule_date" , reserve ,"reserve")}
                                value={moment(reserve.schedule_date).format("YYYY-MM-DDTHH:mm")}
                                onChange={(e)=>setReserve({...reserve ,schedule_date : moment(e.target.value).format("YYYY-MM-DD HH:mm") })}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                variant="outlined"
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

                            <Autocomplete
                            id="combo-box-demo"
                            options={timezone}
                            fullWidth
                            className={classes.space}
                            getOptionLabel={(option) => option.timezone}
                            style={{ width: "100%" }}
                            onChange={(event, newValue) => {
                                if(newValue){
                                    setReserve({...reserve ,timezone : newValue.timezone })
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label={Lang.Booking.package.form.timezone}  variant="outlined" />}
                            />
                            <TextField 
                                className={classes.space}
                                id="outlined-basic" 
                                fullWidth
                                label={Lang.Booking.package.form.coupon}
                                variant="outlined" 
                                name="coupon"
                                value={reserve.coupon}
                                onChange={(e) => setReserve({...reserve ,coupon : e.target.value })}
                                />
                            <TextField 
                                className={classes.space}
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
                                
                   </Fragment>
               )}
            </DialogContent>
            <DialogActions>
            <Button 
                onClick={() => {
                    if(Validator.isFormValid("reserve") && reserve.timezone){
                        SaveReserve();
                    }
                }}
                color="primary">
                Save
            </Button>
            <Button onClick={handleClose} color="primary">
                cancel
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
