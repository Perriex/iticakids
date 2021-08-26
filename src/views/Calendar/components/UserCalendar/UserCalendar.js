import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@material-ui/core';
import TimeTable from "../TimeTable";
import axios from "axios";
import Loading from "../../../Loading";
import moment from "moment";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";

const useStyles = makeStyles((theme) => ({
    root: {
        padding : theme.spacing(3)
    },
    marginBottom : {
        marginBottom : theme.spacing(2)
    }
}));

export default function Calendar(props) {
    const classes = useStyles();
    const { ...rest } = props;
    const [user_id] = useState(props.match.params.user_id)
    const [ showDialog , setShowDialog ] = useState(false);
    const [ showLoading , setLoadingState ] = useState(false);
    const [ mainLoading , setMainLoading ] = useState(false);
    const [ item , setItem ] = useState(null);
    const [ info , setInfo ] = useState(null);
    const [ newDate , setNewDate ] = useState('');

    React.useEffect(() => {
        if(item){
            loadSchedule();
        }
    } , [item]);

    const onClick = (data) => {
        if(data.type != "package"){
            return;
        }
        setShowDialog(true);
        setItem(data);
    }
    
    const loadSchedule = () => {
        setLoadingState(true);
        let data = {
            reserve_id : item.parent_id,
            schedule_id : item.id,
            user_id : user_id
        }
        axios.post(`api/admin/users/session_info` , data).then(res => {
            setLoadingState(false);
            setNewDate(res.data.date);
            setInfo(res.data);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
            setShowDialog(false);
            setItem(null);
        })
    }

    const saveSchedule = () => {
        setLoadingState(true);
        setMainLoading(true);
        let data = {
            reserve_id : item.parent_id,
            schedule_id : item.id,
            user_id : user_id,
            date : newDate,
        }
        axios.post(`api/admin/users/session_info/save` , data).then(res => {
            setLoadingState(false);
            setShowDialog(false);
            setMainLoading(false);
            Toast(Lang.common.success , "success");
        }).catch(err => {
            setLoadingState(false);
            setMainLoading(false);
            Toast(Lang.common.connection_error , "danger");
        })

    }

    return (
        <div className={classes.root}>
            {mainLoading ? (
                <Loading/>
            ) : (
                <Paper>
                    <Dialog
                        open={showDialog}
                        onClose={() => {setShowDialog(false)}}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Edit Session Time
                        </DialogTitle>
                            {showLoading || !info ? (
                                <Loading/>
                            ) : (
                                <div>
                                    <DialogContent>
                                        <TextField
                                            fullWidth
                                            id="outlined-helperText"
                                            label="Package"
                                            value={info.package.name + " - " +info.reserve.staff_package.staff.user.name + " " + info.reserve.staff_package.staff.user.family}
                                            variant="outlined"
                                            className={classes.marginBottom}
                                            onChange={() => {}}
                                            aria-readonly
                                            />
                                        <TextField
                                            id="datetime-local"
                                            label="Next appointment"
                                            type="datetime-local"
                                            defaultValue={moment(newDate).format("YYYY-MM-DDTHH:mm")}
                                            className={classes.marginBottom}
                                            InputLabelProps={{
                                            shrink: true,
                                            }}
                                            onChange={(e) => setNewDate(moment(e.target.value).format("YYYY-MM-DD HH:mm"))}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => {setShowDialog(false)}} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={saveSchedule} color="primary" autoFocus>
                                            Save
                                        </Button>
                                    </DialogActions>
                                </div>
                            )}
                    </Dialog>
                    <TimeTable 
                    {...rest}
                    dataUrl={"api/user/calendar"}
                    postData={{
                        user_id : user_id
                    }}
                    onItemClick={onClick}
                    />
                </Paper>
            )}
           </div>
    );
}
