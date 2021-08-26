import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Typography, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import axios from "axios";
import clsx from 'clsx';
import Loading from "../../../Loading";
import Validator from "../../../../Validator";

const useStyles = makeStyles((theme) => ({
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
}));

export default function ScheduleDatePicker(props) {
    const classes = useStyles();

    const { myPackage , reserve , onSave, title } = props;
    const [ showManageLoading , setManageLoading ] = useState(true);
    const [available , setAvailable] = useState({});
    const [ sessions , setSessions] = useState([1,2,3,4,8,12]);
    const [ newSchedule , setNewSchedule] = useState({});

    React.useEffect(() => {
        if(myPackage){
            getTimes();
        }
    } , [myPackage])


    const getTimes = () => {
        let staff_slug = myPackage.staff_package.staff.slug;
        let package_id = myPackage.staff_package.id;
        setManageLoading(true);
        axios.post(`api/v1.0/staffs/${staff_slug}/${package_id}`).then(res => {
        setManageLoading(false);
        setAvailable(res.data.data.available);
        if(res.data.data.package.type == "single"){
            setSessions([1]);
        }
        }).catch(err => {
        setManageLoading(false);
        })
    }

    
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

    const SaveClicked = () => {
        if(!Validator.isFormValid("schedule")){
            return;
        }
        if(onSave){
            onSave(newSchedule);
        }
    }

    return (
        <div>
            {showManageLoading || !myPackage || !reserve? (
                <Loading/>
            ) : (
                <div className={classes.dir}>
                    <Typography variant="h3">
                    {title}
                    </Typography>
                    <div className={classes.flex}>
                    <FormControl variant="outlined" className={clsx(classes.picker , classes.ml)}>
                        <InputLabel id="demo-simple-select-outlined-label">New Schedule date</InputLabel>
                        <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="New Schedule date"
                        name="schedule_date"
                        error = {Validator.checkInput("schedule_date" , newSchedule , "schedule")}
                        value={reserve.schedule_date}
                        onChange={(e) => setNewSchedule({...newSchedule ,schedule_date : e.target.value })}
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
                    </div>
                    
                    <div className={classes.flex}>
                    <Button variant="contained" onClick={SaveClicked} color="primary" className={clsx(classes.button , classes.ml)}>
                        Save
                    </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
