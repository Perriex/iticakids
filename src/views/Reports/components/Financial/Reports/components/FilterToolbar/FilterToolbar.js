import React  , {useState} from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {
    Grid,
    Button,
    TextField,
} from '@material-ui/core';
import { Toast } from "../../../../../../../config/ToastConfig/Toast.config";
import Filter from '@material-ui/icons/FilterList';
import SaveIcon from '@material-ui/icons/Save';
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
    const { onFilter , onSearch , onExport } = props;
    const [openRangePicker , setRangePickerState] = useState(false);
    const [filter , setFilter ] = useState({
        start_date : null,
        end_date : null,
        timezone : null,
    })
    const [timezones , setTimezones ] = useState([]);

    React.useEffect(() => {
        loadTimezones();
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
    const applyExport = (ext) => {
        if(onExport){
            onExport(filter , ext);
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
                        label={Lang.reports.toolbar.date_range}
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
                        renderInput={(params) => <TextField {...params} label={Lang.reports.toolbar.timezone} variant="outlined" />}
                        onChange={(event, newValue) => {
                            setFilter({...filter , timezone : newValue ? newValue.timezone : null})
                        }}
                        />
                </Grid>
                <Grid item xs={12} md={2} className={classes.space}>
                    <TextField
                        fullWidth
                        id="outlined-helperText"
                        label={Lang.reports.toolbar.search}
                        variant="outlined"
                        onChange={Search}
                        />
                </Grid>
                <Grid item xs={12} md={2} className={classes.space}>
                    {/* <FormControl variant="outlined" fullWidth className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Sort</InputLabel>
                        <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        // value={age}
                        // onChange={handleChange}
                        label="Sort"
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl> */}
                </Grid>
                <Grid item xs={12} md={1} className={classes.space}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<Filter/>}
                        onClick={() => {applyFilter()}}
                    >
                        {Lang.reports.toolbar.filter}
                    </Button>
                </Grid>
                <Grid item xs={12} md={1} className={classes.space}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<SaveIcon/>}
                        onClick={() => {applyExport("xlsx")}}
                    >
                        Excel
                    </Button>
                </Grid>
                <Grid item xs={12} md={1} className={classes.space}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<SaveIcon/>}
                        onClick={() => {applyExport("csv")}}
                    >
                        CSV
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
 
export default FilterToolbar;