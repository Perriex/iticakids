import React  , {useState} from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@material-ui/core';
import { Toast } from "../../../../../../../config/ToastConfig/Toast.config";
import Filter from '@material-ui/icons/FilterList';
import Lang from "../../../../../../../Language";
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative"
    },
    space : {
        padding: theme.spacing(1)
    },
    floatContainer : {
        position : "absolute",
        float : "left"
    },
    floatItem : {
        position : "absolute"
    }
    // dateModal:{
    //     position: "absolute",
    // }
}));
 
const FilterToolbar = props => {
    const classes = useStyles();
    const { onFilter , onTimezone , onSearch , data , onDuration , onPackage} = props;
    const [openRangePicker , setRangePickerState] = useState(false);
    const [filter , setFilter ] = useState({
        start_date : null,
        end_date : null,
    })
    const [timezones , setTimezones ] = useState([]);
    const [packages , setPackages ] = useState([]);
    const [durations , setDurations ] = useState([]);

    React.useEffect(() => {
        loadTimezones();
        if(data){
            let durations = [];
            let packages = [];
            data.forEach( row => {
                if(!durations.includes(row.staff_package.duration)){
                    durations.push(row.staff_package.duration)
                }
                if(!packages.find(k => k.id == row.staff_package.package.id)){
                    packages.push(row.staff_package.package);
                }
            })
            setPackages(packages);
            setDurations(durations);
        }
    } , [])

    const loadTimezones = () => {
        axios.get('api/timezones').then(res => {
            setTimezones(res.data);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
        })
    }
    
    const applyFilter = () => {
        if(onFilter){
            onFilter(filter);
        }
    }

    const Search = (e) => {
        if(onSearch){
            onSearch(e.target.value);
        }
    }

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} md={3} className={classes.space}>
                    <TextField
                        fullWidth
                        id="outlined-helperText"
                        label={Lang.reports.reserves.toolbar.date_range}
                        variant="outlined"
                        onFocus={() => {setRangePickerState(true)}}
                        value={(filter.start_date ? filter.start_date : "-") + "/" + (filter.end_date ? filter.end_date: "-") }
                        />
                        <div className={classes.floatContainer}>
                            <DateRangePicker
                                className={classes.floatItem}
                                open={openRangePicker}
                                toggle={() => {setRangePickerState(false)}}
                                onChange={(range) => {
                                    let start = moment(range.startDate).format("YYYY-MM-DD HH:mm");
                                    let end = moment(range.endDate).format("YYYY-MM-DD HH:mm");
                                    setFilter({...filter , start_date : start , end_date : end});
                                }}
                                />
                        </div>
                </Grid>
                <Grid item xs={12} md={2} className={classes.space}>
                    <Autocomplete
                        id="combo-box-demo"
                        fullWidth
                        options={timezones}
                        getOptionLabel={(option) => option.timezone}
                        renderInput={(params) => <TextField {...params} label={Lang.reports.reserves.toolbar.timezone} variant="outlined" />}
                        onChange={(event, newValue) => {
                            if(onTimezone){
                                onTimezone(newValue ? newValue.timezone : "")
                            }
                        }}
                        />
                </Grid>
                <Grid item xs={12} md={2} className={classes.space}>
                    <TextField
                        fullWidth
                        id="outlined-helperText"
                        label={Lang.reports.reserves.toolbar.search}
                        variant="outlined"
                        onChange={Search}
                        />
                </Grid>
                <Grid item xs={12} md={2} className={classes.space}>
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">{Lang.reports.reserves.toolbar.duration}</InputLabel>
                        <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        // value={age}
                        onChange={(e) => {if(onDuration){onDuration(e.target.value)}}}
                        label={Lang.reports.reserves.toolbar.duration}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {durations.map( (k , i ) => {
                            return (
                                <MenuItem value={k}>{k}</MenuItem>
                            )
                        })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2} className={classes.space}>
                    <Autocomplete
                        id="combo-box-demo"
                        fullWidth
                        options={packages}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label={Lang.reports.reserves.toolbar.package} variant="outlined" />}
                        onChange={(event, newValue) => {
                            if(onPackage){
                                onPackage(newValue ? newValue.name : "")
                            }
                        }}
                        />
                </Grid>
                <Grid item xs={12} md={1} className={classes.space}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<Filter/>}
                        onClick={() => {applyFilter()}}
                    >
                        {Lang.reports.reserves.toolbar.filter}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
 
export default FilterToolbar;