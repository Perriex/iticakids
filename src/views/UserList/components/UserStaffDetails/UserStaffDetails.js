import React, { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import AddIcon from "@material-ui/icons/Add"
import SaveIcon from "@material-ui/icons/Save"
import moment from 'moment';
// import Ring from '@bit/joshk.react-spinners-css.ring';
import axios from "axios";
import { DateRangePicker } from "materialui-daterange-picker";
import { Toast } from '../../../../config/ToastConfig/Toast.config';
import {
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { withRouter } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    FormControl,
    Chip
} from '@material-ui/core';
import Lang from "../../../../Language";
import validator from "../../../../Validator"
import Editor from "../../../../components/Editor";
import StaffProfile from "../../../StaffList/components/StaffProfile";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    space: {
        margin: theme.spacing(1)
    },
    grid_root: {
        padding: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(1)
    },
    p1: {
        padding: theme.spacing(1)
    },
    content: {
        paddingTop: theme.spacing(2)
    },
    content_margin: {
        marginTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    time_bar: {
        display: "flex",
        flexWrap: "wrap",
        justifyItems: "center",
        alignContent: "center",
        alignItems: "center",
    },
    floatContainer: {
        position: "absolute",
        float: "left",
        zIndex: 9999
    },
    floatItem: {
        position: "absolute",
        zIndex: 9999999999
    }
}));

const UserStaffDetails = props => {
    const classes = useStyles();

    const { user_info, isEdit, isProfile, showInfo } = props;

    // const [ freetimes , setFreeTimes ] = useState(user_info ? user_info.freetimes : [])

    React.useEffect(() => {
        console.log("user_info", user_info);

        let _seo = user_info && user_info.staff && user_info.staff.json ? user_info.staff.json.seo : "";
        let _etc = user_info && user_info.staff && user_info.staff.json ? user_info.staff.json : "";
        setSeo(_seo);
        setEtc(_etc)
        // setFreeTimes(user_info ? (user_info.free_times ? user_info.free_times : []) : [])
        setFreeTimesList(user_info ? (user_info.free_times ? user_info.free_times : []) : []);
        setSuspendStartDate(user_info && user_info.staff ? user_info.staff.suspend_start_time : new Date());
        setSuspendEndDate(user_info && user_info.staff ? user_info.staff.suspend_end_time : new Date());
        setUserInfo(user_info);
        setProfile(user_info);
        setBio(user_info.staff.biography);
    }, [user_info]);

    // const freetimes = [
    //     ["Monday" , "11:00" , "12:00"],
    //     ["Sunday" , "11:00" , "12:00"],
    //     ["Friday" , "11:00" , "12:00"],
    //     ["Thursday" , "11:00" , "12:00"]
    // ];

    const [user_slug] = useState(props.match.params.user_id);


    const [selectedStartTime, setSelectedStartDate] = useState(new Date());
    const [selectedEndTime, setSelectedEndDate] = useState(new Date());
    const [openRangePicker, setRangePickerState] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');

    const [suspend_start_date, setSuspendStartDate] = useState(new Date());
    const [suspend_end_date, setSuspendEndDate] = useState(new Date());

    const [showLoading, setLoadingState] = useState(false);
    const [bio, setBio] = useState("");

    const { openDialog, onDialogClosed, current_package } = props;

    const [user, setUserInfo] = useState({ staff: {} })
    const [profile, setProfile] = useState({});
    const [seo, setSeo] = useState("");
    const [etc, setEtc] = useState({});

    const [freetimes_list, setFreeTimesList] = useState([]);

    const validateSuspendDates = () => {
        if (!user.staff.suspended) {
            return true;
        }
        var d1 = new Date(suspend_start_date);
        var d2 = new Date(suspend_end_date);
        if (d1.getTime() < d2.getTime()) {
            return true;
        }
        return false;
    }

    const onUserInfoChange = (_user) => {
        setProfile(_user);
    }

    const defineNewStaff = (user_id, free_times, biography, json = null, callback) => {
        setLoadingState(true);
        let data = { free_times: JSON.stringify(free_times), biography: biography };
        data.json = JSON.stringify({ ...etc , seo: seo });
        let form = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                form.append(key, item);
            }
        }
        let temo_user = { ...profile };
        delete temo_user.staff;
        for (const key in temo_user) {
            if (temo_user.hasOwnProperty(key)) {
                const item = temo_user[key];
                form.append(key, item);
            }
        }

        axios.post('api/admin/staffs', form).then(res => {
            Toast(Lang.common.success, "success");
            setLoadingState(false);
            props.history.replace(window.dashboard_url + "/staffs/");
        }).catch(err => {
            setLoadingState(false)
            if (err.response.status == 422) {
                Toast(Lang.common.input_error, "danger");
            } else {
                Toast(Lang.common.connection_error, "danger");
            }
        });
    };


    const staffUpdateInfo = (staffSlug, free_times) => {

        setLoadingState(true);
        // TODO 'api/admin/staffs/{STAFF_SLUG}' -> staffUpdateInfo
        // let data = { biography: biography, free_times: free_times, suspended: suspended, suspended_start_time: suspended_start_time, suspended_end_time: suspended_end_time, active: active};
        let data = { ...user.staff };
        data.free_times = JSON.stringify(free_times);
        // data.free_times = JSON.stringify(data.freetimes);
        data.json = JSON.stringify({ ...etc , seo: seo });
        data.biography = bio;
        if (suspend_start_date) {
            data.suspend_start_time = suspend_start_date;
            data.suspend_end_time = suspend_end_date;
        }

        let form = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                if (item != null) {
                    form.append(key, item);
                }
            }
        }
        let temo_user = { ...profile };
        delete temo_user.free_times;
        delete temo_user.staff;
        delete temo_user.star;
        console.log("profile", temo_user);
        for (const key in temo_user) {
            if (temo_user.hasOwnProperty(key)) {
                const item = temo_user[key];
                if (item != null) {
                    form.append(key, item);
                }
            }
        }

        axios.post(`api/admin/staffs/${staffSlug}`, form).then(res => {
            setLoadingState(false);
            Toast(Lang.common.success, "success");
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error, "danger");
        });
    };

    const setUserSuspendedState = () => {
        let temp_user = user;
        temp_user.staff.suspended = user.staff.suspended == 1 ? 0 : 1;
        setUserInfo({ ...temp_user })
    }

    const setBiograhy = (model) => {
        // let temp_user = user;
        // temp_user.staff.biography = model;
        // setUserInfo({...temp_user})
        // let temp_user = user;
        // temp_user.staff.biography = model;
        // setUserInfo({...user , staff : { ... user.staff , biography : model}})
        setBio(model);
    }

    const setStaffActiveState = (e) => {
        let temp_user = user;
        temp_user.staff.active = user.staff.active ? 0 : 1;
        setUserInfo({ ...temp_user })
    }

    const deleteFreeTime = (time) => {
        let index = freetimes_list.findIndex(k => k[0] == time[0] && k[1] == time[1] && k[2] == time[2]);
        delete freetimes_list[index];
        setFreeTimesList(freetimes_list.filter(k => k != null));
    }

    const onDaySelect = (e) => {
        setSelectedDay(e.target.value)
    }

    const onStartTimeSet = (date) => {
        setSelectedStartDate(date);

    }

    const onEndTimeSet = (date) => {
        setSelectedEndDate(date);
    }

    const onSuspendStartDateSet = (date) => {
        setSuspendStartDate(date);
    }

    const onSuspendEndDateSet = (date) => {
        setSuspendEndDate(date);
    }

    const onNewFreeTime = () => {
        if (selectedStartTime && selectedEndTime && selectedDay && (moment(selectedStartTime) < moment(selectedEndTime))) {
            let time = [selectedDay, moment(selectedStartTime).format('HH:mm'), moment(selectedEndTime).format('HH:mm')];

            if (!freetimes_list.find(k => {
                let day = k[0];
                let start = moment("2020/02/02 " + k[1]).format("X");
                let end = moment("2020/02/02 " + k[2]).format("X");

                let new_start = moment("2020/02/02 " + time[1]).format("X");
                let new_end = moment("2020/02/02 " + time[2]).format("X");
                return (
                    day == time[0] &&
                    (
                        (
                            start < new_end &&
                            end > new_end
                        ) ||
                        (
                            end > new_start &&
                            start < new_start
                        ) ||
                        end == new_end ||
                        start == new_start
                    )
                )
            })) {
                setFreeTimesList([...freetimes_list, time]);
            }
        }

    }



    const onStaffSave = () => {
        var times = {};
        if (user_slug) {
            staffUpdateInfo(user_slug, freetimes_list);
        } else {
            defineNewStaff(
                user_info.id,
                freetimes_list,
                bio,
                user.staff.json
            );
        }
    }

    return (
        <Card className={classes.content_margin}>
            <CardContent>
                {(isProfile && showInfo) || (!isProfile) ? (
                    <Fragment>
                        <Typography component="h5" variant="h5">
                            {Lang.staffs.form.title}
                        </Typography>
                        <Grid
                            container
                            className={classes.content}>
                            <Grid
                                item
                                className={classes.grid_root}
                                md={isProfile ? 12 : 6}

                                xs={12}
                            >
                                <Typography component="h4" variant="h4">
                                    {Lang.staffs.form.bio}
                                </Typography>
                                <Editor
                                    model={bio}
                                    onModelChange={setBiograhy}

                                />
                                <TextField
                                    fullWidth
                                    label={Lang.staffs.form.seo}
                                    margin="dense"
                                    name="seo"
                                    onChange={e => setSeo(e.target.value)}
                                    value={seo}
                                    variant="outlined"
                                />
                                  <TextField
                                    fullWidth
                                    label={Lang.staffs.form.programTaught}
                                    margin="dense"
                                    name="programTaught"
                                    onChange={e => setEtc({ ...etc, programTaught: e.target.value })}
                                    value={etc.programTaught}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label={Lang.staffs.form.ageGroup}
                                    margin="dense"
                                    name="ageGroup"
                                    onChange={e => setEtc({ ...etc, ageGroup: e.target.value })}
                                    value={etc.ageGroup}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label={Lang.staffs.form.TeachSince}
                                    margin="dense"
                                    name="TeachSince"
                                    onChange={e => setEtc({ ...etc, TeachSince: e.target.value })}
                                    value={etc.TeachSince}
                                    variant="outlined"
                                />
                                 <TextField
                                    fullWidth
                                    label={Lang.staffs.form.LanguagesSpoken}
                                    margin="dense"
                                    name="LanguagesSpoken"
                                    onChange={e => setEtc({ ...etc, LanguagesSpoken: e.target.value })}
                                    value={etc.LanguagesSpoken}
                                    variant="outlined"
                                />
                               
                            </Grid>
                            {isProfile ? null : (
                                <Grid
                                    item
                                    className={classes.grid_root}
                                    md={6}
                                    xs={12}
                                >
                                    <StaffProfile isEdit={isEdit} user={profile} onUserInfoChange={onUserInfoChange} />
                                </Grid>
                            )}
                        </Grid>
                        <Divider />
                    </Fragment>
                ) : null}
                {(isProfile && showInfo) ? null : (
                    <Fragment>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Typography component="h5" className={classes.p1} variant="h5">
                                    {Lang.staffs.form.free_times}*
                                </Typography>

                                <div
                                    className={classes.time_bar}
                                >
                                    <FormControl variant="filled" className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-filled-label">{Lang.staffs.form.day}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-filled-label"
                                            id="demo-simple-select-filled"
                                            className={classes.p1}
                                            onChange={onDaySelect}
                                            value={selectedDay}
                                        >
                                            <MenuItem value={"Sunday"}>{Lang.days.SUN}</MenuItem>
                                            <MenuItem value={"Monday"}>{Lang.days.MON}</MenuItem>
                                            <MenuItem value={"Tuesday"}>{Lang.days.TUE}</MenuItem>
                                            <MenuItem value={"Wednesday"}>{Lang.days.WED}</MenuItem>
                                            <MenuItem value={"Thursday"}>{Lang.days.THU}</MenuItem>
                                            <MenuItem value={"Friday"}>{Lang.days.FRI}</MenuItem>
                                            <MenuItem value={"Saturday"}>{Lang.days.SAT}</MenuItem>
                                        </Select>

                                    </FormControl>

                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        label={Lang.staffs.form.start}
                                        value={selectedStartTime}
                                        onChange={onStartTimeSet}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                    <KeyboardTimePicker
                                        className={classes.p1}
                                        margin="normal"
                                        id="end-time-picker"
                                        label={Lang.staffs.form.end}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        value={selectedEndTime}
                                        onChange={onEndTimeSet}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<AddIcon />}
                                        onClick={onNewFreeTime}
                                    >
                                        {Lang.common.add}
                                    </Button>
                                </div>
                                {freetimes_list.map((k, i) => {
                                    return (
                                        <Chip
                                            key={i}
                                            className={classes.space}
                                            label={Lang.days[k[0]] + " , " + k[1] + " - " + k[2]}
                                            onDelete={() => deleteFreeTime(k)}
                                        />
                                    )
                                })}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div>
                                    {user_slug ? (
                                        <div>
                                            <FormControlLabel
                                                control={<Checkbox checked={user.staff.suspended == 1} onChange={setUserSuspendedState} />}
                                                label={Lang.staffs.form.suspended}
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={user.staff.active == 1} onChange={setStaffActiveState} />}
                                                label={Lang.staffs.form.active}
                                            />
                                            <div>
                                                {user.staff.suspended == 1 ? (
                                                    <div className={classes.space}>
                                                        <TextField
                                                            fullWidth
                                                            id="outlined-helperText"
                                                            label={Lang.reports.toolbar.date_range}
                                                            variant="outlined"
                                                            onFocus={() => { setRangePickerState(true) }}
                                                            value={(suspend_start_date ? suspend_start_date : "-") + "/" + (suspend_end_date ? suspend_end_date : "-")}
                                                        />
                                                        <div className={classes.floatContainer}>
                                                            <DateRangePicker
                                                                className={classes.floatItem}
                                                                open={openRangePicker}
                                                                toggle={() => { setRangePickerState(false) }}
                                                                onChange={(range) => {
                                                                    let start = moment(range.startDate).format("YYYY-MM-DD HH:mm");
                                                                    let end = moment(range.endDate).format("YYYY-MM-DD HH:mm");
                                                                    setSuspendStartDate(start);
                                                                    setSuspendEndDate(end);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </Grid>
                        </Grid>
                    </Fragment>
                )}
                <Divider ligth="true" />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={() => {
                        if (!validator.isFormValid()) {
                            Toast("Please Fill Staff Info", "error");
                            return;
                        }
                        if (!bio) {
                            Toast("لطفا درباره استاد را وارد کنید.", "error");
                            return;
                        }
                        if (!freetimes_list.length) {
                            Toast("لطفا زمان های خالی استاد را تعریف کنید.", "error");
                            return;
                        }
                        if (user.staff.suspended == 1 && !validateSuspendDates()) {
                            Toast("بازه زمانی تعلیق صحیح نیست!", "error");
                            return;
                        }
                        onStaffSave();

                    }}
                >
                    {Lang.common.save}
                    {showLoading ? (
                        // <Ring size={20} />
                        <></>
                    ) : null}
                </Button>
            </CardContent>
        </Card>
    );
};


export default withRouter(UserStaffDetails);
