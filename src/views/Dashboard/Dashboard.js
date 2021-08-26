import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
} from '@material-ui/core';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import {Calendar } from 'react-modern-calendar-datepicker';
import "./style.css";
import axios from "axios";
import Loading from "../Loading";
import Lang from "../../Language"
import { Toast } from "../../config/ToastConfig/Toast.config";
import clsx from 'clsx';
import { Schedules } from "./components"
import settings from "../../config/siteSettings";

const useStyles = makeStyles((theme) => ({
  root: {
      padding : theme.spacing(3)
  },
  exsists : {
    background : (settings.getFrom("colors","primary-dark") ? settings.getFrom("colors","primary-dark") : "#448AF4"),
    color : "#fff"
  },
  fullWidth : {
      width : "100%"
    }
}));

export default function SimplePaper() {
    const classes = useStyles();
    
    const [ date , setDate ] = useState(new Date());
    const [ showLoading , setLoadingState ] = useState(false);
    const [ selectedDayRange, setSelectedDayRange] = useState([]);
    const [ today , setToday ] = useState(new Date());
    const [ schedules , setSchedules ] = useState([]);

    React.useEffect(() => {
        getCalendar();
        setMonthChangeEvents();
    } , [])

    React.useEffect(() => {
        getCalendarSchedules();
    } , [today])

    const getCalendar = () => {
        let data = {
            date : date
        };
        axios.post(`api/user/dashboard_calendar` , data).then(res => {
            setSelectedDayRange(res.data.map(k => {return {...k , className : classes.exsists}}));
        }).catch ( err => {
            Toast(Lang.common.connection_error , "danger");
        })
    }

    const getCalendarSchedules = () => {
        setLoadingState(true);
        let data = {
            date : today
        };
        axios.post(`api/user/dashboard_calendar_schedules` , data).then(res => {
            setLoadingState(false);
            setSchedules(res.data);
        }).catch ( err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        })
    }

    const setMonthChangeEvents = () => {
        let nbtn = document.querySelector("[aria-label='Next Month']");
        let pbtn = document.querySelector("[aria-label='Previous Month']");
        if(pbtn){
            pbtn.addEventListener("click" , () => {
                setDate(addMonths(date , -1));
                getCalendar();
            })
        }
        if(nbtn){
            nbtn.addEventListener("click" , () => {
                setDate(addMonths(date , 1));
                getCalendar();
            })
        }
    }

    function addMonths(date, months) {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() != d) {
          date.setDate(0);
        }
        return date;
    }

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} md={3}>
                    <Calendar
                    onChange={(d) => {setToday(`${d.year}-${d.month}-${d.day}`)}}
                    customDaysClassName={selectedDayRange}
                    // shouldHighlightWeekends
                    />
                </Grid>
                <Grid item xs={12} md={9} >
                    <Paper className={clsx(classes.fullWidth , classes.root)}>
                        {showLoading ? (
                            <Loading/>
                        ) : (
                            <Schedules rows={schedules}/>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
  );
}
