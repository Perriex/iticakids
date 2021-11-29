import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Grid,
    Divider,
    TextField,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Chip,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import moment from "moment";
import axios from "axios";
import placeholder from "../../../../assets/placeholder.png";
import PlusIcon from '@material-ui/icons/Add';
import Editor from "../../../../components/Editor";
import Loading from "../../../Loading";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import Lang from "../../../../Language";
import StaffPicker from "../../../CouponList/components/StaffPicker";
import Validator from "../../../../Validator";
import { withRouter } from 'react-router-dom';
import {
    KeyboardDateTimePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        padding: theme.spacing(1)
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    },
    marginTop: {
        marginTop: theme.spacing(2)
    },
    media: {
        height: "100%",
        width: "100%",
        maxheight: "200px",
        objectFit: "cover"
    },
    flex: {
        display: "flex"
    },
    space: {
        margin: theme.spacing(1)
    }
}));

const WorkshopInfo = props => {
    const { className, ...rest } = props;

    const [isEdit] = useState(!!props.match.params.workshop_slug)
    const [workshop_slug] = useState(props.match.params.workshop_slug)
    const [showLoading, setLoadingState] = useState(false);
    const [workshop, setWorkshop] = useState({ json: {} });
    const [image, setImage] = React.useState("");
    const [staffPicker, setStaffPicker] = useState(false);
    const [staff, setStaff] = useState(false);
    const [desc, setDesc] = useState("");
    const [body, setBody] = useState("");
    const [sessions, setSessions] = useState([]);
    const [newSession, setNewSession] = useState("");
    const [startInputValue, setStartInputValue] = useState(workshop.start_at ? new moment(workshop.start_at).format("YYYY-MM-DD HH:mm") : new moment().format("YYYY-MM-DD HH:mm"));
    const [endInputValue, setEndInputValue] = useState(workshop.expire_at ? new moment(workshop.expire_at).format("YYYY-MM-DD HH:mm") : new moment().format("YYYY-MM-DD HH:mm"));



    React.useEffect(() => {
        if (isEdit) {
            getWorkshop()
        }
    }, []);

    const classes = useStyles();

    const getWorkshop = () => {
        setLoadingState(true);

        axios.get(`api/admin/workshops/${workshop_slug}`).then(res => {
            let data = res.data;
            if (data.json) {
                data.json = JSON.parse(data.json);
            } else {
                data.json = {};
            }
            setWorkshop(data);
            setDesc(data.desc);
            setBody(data.body);
            setStartInputValue(data.start_at)
            setEndInputValue(data.expire_at)
            if (res.data.banner) {
                setImage(axios.defaults.baseURL + res.data.banner);
            }
            setSessions(res.data.sessions.map(k => moment(k.start_date).format("YYYY-MM-DD HH:mm")))
            res.data.staff.user.staff = res.data.staff;
            setStaff({ ...res.data.staff.user, staffId: res.data.staff.id });
            setLoadingState(false);
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error, "danger");
        });
    }


    const imageSelectedHandler = e => {
        if (!e.target.files.length) {
            return;
        }
        let avatar = e.target.files[0];
        setImage(e.target.files[0].name);
        setWorkshopData("banner", avatar);
        // updateUser(user.name, user.family, avatar);

        // TODO this part can be deleted until end of this function. -------------------
        // because the avatar should be loaded from props, not state!
        var reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
        };
        // setImageName(e.target.files[0].name);
        reader.readAsDataURL(e.target.files[0]);
    };

    const onStaffPick = staff => {
        console.log('sg', staff)
        setStaff(staff);
        // setCoupon({...coupon , staff_id : staff.staff.id})
    }

    const setWorkshopData = (name, data, is_json = false) => {
        if (is_json) {
            setWorkshop({ ...workshop, json: { ...workshop.json, [name]: data } });
        } else {
            setWorkshop({ ...workshop, [name]: data });
        }
    }


    console.log('workshop', workshop)
    const addSession = () => {
        if (newSession) {
            let temp = sessions;
            if (!temp.find(k => k == newSession)) {
                setSessions([...sessions, newSession]);
            }
        }
    }

    const deleteSession = (session) => {
        let temp = sessions.filter(k => k != session);
        setSessions(temp);
    }

    const saveChanges = () => {
        if (isEdit) {
            updateWorkshop()
        } else {
            newWorkshop();
        }
    }

    const updateWorkshop = () => {
        setLoadingState(true);
        let data = new FormData();
        data.append("title", workshop.title);
        data.append("duration", workshop.duration);
        data.append("capacity", workshop.capacity);
        data.append("start_at", workshop.start_at);
        data.append("expire_at", workshop.expire_at);
        data.append("price", workshop.price);
        data.append("is_group_class", (workshop.is_group_class == true || workshop.is_group_class == 1) ? "1" : "0");
        // data.append("ir_price", workshop.ir_price);
        data.append("ir_price", '0');
        if (workshop.type) {
            data.append("type", workshop.type);
        }
        data.append("body", workshop.body);
        data.append("desc", workshop.desc);
        data.append("lang", workshop.lang);
        data.append("staff_commission", workshop.staff_commission);
        data.append("link", workshop.workshop_link);
        // data.append("staff_id" , staff.staff.id);
        data.append("staff_id", staff.staffId || staff.id);
        data.append("banner", workshop.banner);
        data.append("json", JSON.stringify(workshop.json));
        data.append("sessions", sessions.length);
        sessions.forEach((session, i) => {
            data.append(`sessions_timing[${i}]`, session);
        });

        axios.post(`api/admin/workshops/${workshop_slug}`, data).then(res => {
            setLoadingState(false);
            Toast(Lang.common.success, "success");
            props.history.replace(window.dashboard_url + "/workshops");
        }).catch(err => {
            setLoadingState(false);
            if (err.response.status == 422) {
                // console.log('err.response.data.errors',err.response.data.errors['title'][0])
                // Live Online Music Lessons for Kids! Sundays
                Object.keys(err.response.data.errors).map(function(key, index) {
                    // myObject[key] *= 2;
                    err.response.data.errors[key].map((err)=>{
                        Toast(err, "danger");
                    })
                  });
            } else {
                Toast(Lang.common.connection_error, "danger");
            }
        });
    }

    const newWorkshop = () => {
        setLoadingState(true);
        let data = new FormData();
        data.append("title", workshop.title);
        data.append("duration", workshop.duration);
        data.append("capacity", workshop.capacity);
        data.append("start_at", workshop.start_at);
        data.append("expire_at", workshop.expire_at);
        data.append("is_group_class", (workshop.is_group_class == true || workshop.is_group_class == 1) ? "1" : "0");
        data.append("price", workshop.price);
        // data.append("ir_price", workshop.ir_price);
        data.append("ir_price", '0');

        if (workshop.type) {
            data.append("type", workshop.type);
        }
        data.append("body", workshop.body);
        data.append("desc", workshop.desc);
        data.append("staff_commission", workshop.staff_commission);
        data.append("lang", workshop.lang);
        data.append("link", workshop.workshop_link);
        // data.append("staff_id" , staff.staff.id);
        data.append("staff_id", staff.id);

        data.append("json", JSON.stringify(workshop.json));
        data.append("banner", workshop.banner);
        data.append("sessions", sessions.length);
        sessions.forEach((session, i) => {
            data.append(`sessions_timing[${i}]`, session);
        });

        axios.post(`api/admin/workshops`, data).then(res => {
            setLoadingState(false);
            Toast(Lang.common.success, "success");
            props.history.replace(window.dashboard_url + "/workshops");
        }).catch(err => {
            setLoadingState(false);
            if (err.response.status == 422) {
                Toast(Lang.common.input_error, "danger");
            } else {
                Toast(Lang.common.connection_error, "danger");
            }
        });
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            {showLoading ? (
                <Loading />
            ) : (
                <Fragment>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography variant="h2" component="h2">
                                {isEdit ? Lang.workshop.edit_title : Lang.workshop.new_title}
                            </Typography>
                            <Divider />
                            <Grid container >
                                <Grid item xs={12} md={4} className={classes.root}>
                                    <div>
                                        <div className="image_selector">
                                            <div className={classes.details}>
                                                <img
                                                    className={classes.media}
                                                    src={image ? image : placeholder}
                                                />
                                            </div>
                                            <input onChange={imageSelectedHandler} style={{ display: 'none' }} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                                            <label htmlFor="contained-button-file">
                                                <Button className={classes.uploadButton} color="primary" variant="text" component="span">
                                                    {Lang.workshop.form.select_banner}
                                                </Button>
                                            </label>
                                        </div>
                                        <Grid container>
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="Duration"
                                                    fullWidth
                                                    label={Lang.workshop.form.duration}
                                                    required
                                                    error={Validator.checkInput("duration", workshop)}
                                                    type="number"
                                                    value={workshop.duration}
                                                    onChange={(e) => setWorkshopData("duration", e.target.value)}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="capacity"
                                                    fullWidth
                                                    type="number"
                                                    label={Lang.workshop.form.capacity}
                                                    required
                                                    error={Validator.checkInput("capacity", workshop)}
                                                    value={workshop.capacity}
                                                    onChange={(e) => setWorkshopData("capacity", e.target.value)}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="Link"
                                                    fullWidth
                                                    label={Lang.workshop.form.link}
                                                    required
                                                    error={Validator.checkInput("workshop_link", workshop)}
                                                    value={workshop.workshop_link}
                                                    onChange={(e) => setWorkshopData("workshop_link", e.target.value)}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="lang"
                                                    fullWidth
                                                    label={Lang.workshop.form.lang}
                                                    required
                                                    error={Validator.checkInput("lang", workshop)}
                                                    value={workshop.lang}
                                                    onChange={(e) => setWorkshopData("lang", e.target.value)}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12} className={classes.content}>
                                                <KeyboardDateTimePicker
                                                    id="start_at-local"
                                                    label={Lang.workshop.form.start_at}
                                                    fullWidth
                                                    required
                                                    format="yyyy/MM/dd HH:mm"
                                                    error={Validator.checkInput("start_at", workshop)}
                                                    className={classes.textField}
                                                    inputVariant="outlined"
                                                    inputValue={startInputValue}

                                                    value={workshop.start_at ? new Date(workshop.start_at) : new Date()}
                                                    onChange={(e, value) => {
                                                        setWorkshopData("start_at", moment(e).format("YYYY-MM-DD HH:mm"))
                                                        setStartInputValue(value);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12} className={classes.content}>
                                                <KeyboardDateTimePicker
                                                    id="expire_at-local"
                                                    label={Lang.workshop.form.expire_at}
                                                    fullWidth
                                                    required
                                                    format="yyyy/MM/dd HH:mm"
                                                    error={Validator.checkInput("expire_at", workshop)}
                                                    className={classes.textField}
                                                    inputVariant="outlined"
                                                    inputValue={endInputValue}
                                                    value={workshop.expire_at ? new Date(workshop.expire_at) : new Date()}
                                                    onChange={(e, value) => {
                                                        setWorkshopData("expire_at", moment(e).format("YYYY-MM-DD HH:mm"))
                                                        setEndInputValue(value);

                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="Price"
                                                    fullWidth
                                                    label={Lang.workshop.form.price}
                                                    variant="outlined"
                                                    required
                                                    error={Validator.checkInput("price", workshop)}
                                                    value={workshop.price}
                                                    onChange={(e) => setWorkshopData("price", e.target.value)}
                                                />
                                            </Grid>
                                            {/* <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="IR Price"
                                                    fullWidth
                                                    label={Lang.workshop.form.ir_price}
                                                    required
                                                    error={Validator.checkInput("ir_price", workshop)}
                                                    variant="outlined"
                                                    value={workshop.ir_price}
                                                    onChange={(e) => setWorkshopData("ir_price", e.target.value)}
                                                />
                                            </Grid> */}
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                                                    <InputLabel id="demo-simple-select-outlined-label">{Lang.workshop.form.type}</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        value={workshop.type}
                                                        onChange={(e) => setWorkshopData("type", e.target.value)}
                                                        label={Lang.workshop.form.type}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        <MenuItem value={"daily"}>{Lang.workshop.form.type_daily}</MenuItem>
                                                        <MenuItem value={"biweekly"}>{Lang.workshop.form.type_weekly}</MenuItem>
                                                        <MenuItem value={"weekly"}>{Lang.workshop.form.type_biweekly}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6} className={classes.content}>
                                                {staff ? (
                                                    <div className={classes.flex}
                                                        onClick={() => setStaffPicker(!staffPicker)}
                                                    >
                                                        <Typography variant="body1">{Lang.coupon.list.form.for_staff} </Typography>
                                                        <div className={classes.marginLeft}>
                                                            <Avatar
                                                                className={classes.avatar}
                                                                src={staff.avatar ? axios.defaults.baseURL + staff.avatar : null}
                                                            >
                                                                {staff.name}
                                                            </Avatar>
                                                            <Typography variant="body1">{staff.name}</Typography>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => setStaffPicker(!staffPicker)}
                                                        color="primary"
                                                        variant="contained"
                                                    >
                                                        {Lang.workshop.form.select_staff}
                                                    </Button>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6} className={classes.content}>
                                                <TextField
                                                    id="age"
                                                    fullWidth
                                                    label={Lang.workshop.form.age}
                                                    variant="outlined"
                                                    required
                                                    type="text"
                                                    // error={Validator.checkInput("staff_commission", workshop)}
                                                    value={workshop.json.age}
                                                    onChange={(e) => setWorkshopData("age", e.target.value, true)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12} className={classes.content}>
                                                <TextField
                                                    id="staff_comission"
                                                    fullWidth
                                                    label={Lang.workshop.form.staff_commission}
                                                    variant="outlined"
                                                    required
                                                    type="number"
                                                    error={Validator.checkInput("staff_commission", workshop)}
                                                    value={workshop.staff_commission}
                                                    onChange={(e) => setWorkshopData("staff_commission", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid xs={12} md={12}>
                                                <Divider />
                                                <Typography variant="h5" component="h5" className={classes.marginTop}>
                                                    {Lang.workshop.form.sessions}
                                                </Typography>
                                                <div className={classes.flex}>
                                                    <IconButton color="primary" onClick={addSession} component="span">
                                                        <PlusIcon />
                                                    </IconButton>
                                                    <KeyboardDateTimePicker
                                                        id="expire_at-local"
                                                        label={Lang.workshop.form.session_start_time}
                                                        fullWidth
                                                        format="yyyy/MM/dd HH:mm"
                                                        className={classes.textField}
                                                        inputVariant="outlined"
                                                        onChange={(e) => setNewSession(moment(e).format("Y-MM-DD HH:mm"))}
                                                    />
                                                </div>

                                                <div>
                                                    {sessions.map((k, i) => {
                                                        return (
                                                            <Chip label={k} key={i} className={classes.space} onDelete={() => deleteSession(k)} color="primary" variant="outlined" />
                                                        )
                                                    })}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={8} className={classes.root}>
                                    <div>
                                        <TextField
                                            className={classes.marginBottom}
                                            fullWidth
                                            id="outlined-helperText"
                                            label={Lang.workshop.form.title}
                                            value={workshop.title}
                                            required
                                            error={Validator.checkInput("title", workshop)}
                                            onChange={(e) => setWorkshopData("title", e.target.value)}
                                            helperText={Lang.workshop.title_hint}
                                            variant="outlined"
                                        />
                                        <Typography variant="h5" component="h5">
                                            {Lang.workshop.form.desc}
                                        </Typography>
                                        <Editor
                                            apiKey="f1of5cynghcbae8ubznimgwksqvn4azrbnaf2x3fq9ilped8"

                                            model={desc} onModelChange={(e) => { setWorkshopData("desc", e) }} height={200} />
                                        <Typography variant="h5" component="h5" className={classes.marginTop}>
                                            {Lang.workshop.form.body}
                                        </Typography>
                                        <Editor
                                            apiKey="f1of5cynghcbae8ubznimgwksqvn4azrbnaf2x3fq9ilped8"

                                            model={body} onModelChange={(e) => { setWorkshopData("body", e) }} />
                                        <TextField
                                            fullWidth
                                            label="keywords"
                                            className={classes.marginTop}
                                            variant="outlined"
                                            value={workshop.json.keywords}
                                            onChange={(e) => setWorkshopData("keywords", e.target.value, true)}
                                        />
                                        <TextField
                                            fullWidth
                                            className={classes.marginTop}
                                            label="seo"
                                            multiline
                                            variant="outlined"
                                            value={workshop.json.seo}
                                            onChange={(e) => setWorkshopData("seo", e.target.value, true)}
                                        />
                                           <TextField
                                            fullWidth
                                            className={classes.marginTop}
                                            label="level"
                                            multiline
                                            variant="outlined"
                                            value={workshop.json.level}
                                            onChange={(e) => setWorkshopData("level", e.target.value, true)}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={workshop.is_group_class == 0 ? false : true} onChange={(e) => setWorkshopData("is_group_class", e.target.checked)} />}
                                            label={Lang.staffs.form.is_group_class}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    if (!Validator.isFormValid()) {
                                        Toast(Lang.workshop.form.error_required, "danger");
                                        return;
                                    }
                                    if (!workshop.desc) {
                                        Toast(Lang.workshop.form.error_desc, "danger");
                                        return;
                                    }

                                    if (!workshop.body) {
                                        Toast(Lang.workshop.form.error_body, "danger");
                                        return;
                                    }

                                    if (!staff) {
                                        Toast(Lang.workshop.form.error_staff, "danger");
                                        return;
                                    }
                                    if (!sessions.length) {
                                        Toast(Lang.workshop.form.error_sessions, "danger");
                                        return;
                                    }
                                    if (Validator.isFormValid()) {
                                        saveChanges()
                                    }
                                }}
                            >
                                {Lang.common.save}
                            </Button>
                        </CardActions>
                    </Card>

                    <div className={classes.marginTop}>
                        {staffPicker ? (
                            <StaffPicker onStaffPick={onStaffPick} />
                        ) : null}
                    </div>
                </Fragment>
            )}
        </div>
    );
};


export default withRouter(WorkshopInfo);
