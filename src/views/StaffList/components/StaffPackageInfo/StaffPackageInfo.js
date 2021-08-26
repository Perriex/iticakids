import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    Typography,
    FormControlLabel,
    FormControl,
    Checkbox,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import Lang from "../../../../Language";
import Validator from "../../../../Validator";

const useStyles = makeStyles(theme => ({
    space: {
        padding: theme.spacing(1)
    }, grid: {
        padding: theme.spacing(1)
    },
    inner: {

    },
    formControl: {
        width: "100%"
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    }
}));


const StaffPackageInfo = props => {

    const { onDataChanged, currentPackage } = props;

    const [mpackage, setPackage] = useState({});

    const classes = useStyles();

    React.useEffect(() => {
        if (currentPackage) {
            console.log('current???', currentPackage)
            let types = [];
            // currentPackage?.types?.map((type) => {
            //     types.push(type.type)
            // })
            setPackage({ ...currentPackage, type: [...types] });
        }
        
    }, [currentPackage]);

    React.useEffect(() => {
        if (onDataChanged) {
            onDataChanged(mpackage)
        }
    });

    const setData = (e) => {
        if (e) {
            setPackage({ ...mpackage, [e.target.name]: e.target.value });
            console.log('mpackage', { ...mpackage, [e.target.name]: e.target.value })
        }

    }

    return (
        <div>
            <Typography component="h5" variant="h5" className={classes.space}>
                {Lang.staffs.packages.form.info}
            </Typography>
            <Grid
                container
            >
                <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label={Lang.staffs.packages.form.dur}
                        margin="dense"
                        name="duration"
                        required
                        type="number"
                        variant="outlined"
                        error={Validator.checkInput("duration", mpackage)}
                        value={mpackage.duration}
                        onChange={setData}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label={Lang.staffs.packages.form.staff_comission}
                        margin="dense"
                        name="staff_commission"
                        required
                        error={Validator.checkInput("staff_commission", mpackage)}
                        type="number"
                        variant="outlined"
                        value={mpackage.staff_commission}
                        onChange={setData}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label={Lang.staffs.packages.form.price}
                        margin="dense"
                        name="price"
                        required
                        type="number"
                        error={Validator.checkInput("price", mpackage)}
                        variant="outlined"
                        value={mpackage.price}
                        onChange={setData}
                    />
                </Grid>
                {/* <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label={Lang.staffs.packages.form.ir_price}
                        margin="dense"
                        name="ir_price"
                        required
                        type="number"
                        error={Validator.checkInput("ir_price", mpackage)}
                        variant="outlined"
                        value={mpackage.ir_price}
                        onChange={setData}
                    />
                </Grid> */}
                <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label={Lang.staffs.packages.form.cal_limit}
                        margin="dense"
                        name="calendar_limit"
                        required
                        type="number"
                        error={Validator.checkInput("calendar_limit", mpackage)}
                        variant="outlined"
                        value={mpackage.calendar_limit}
                        onChange={setData}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.grid}
                    md={12}
                    xs={12}
                >
                    <FormControl variant="outlined" className={classes.formControl} fullwidth="true">
                        <InputLabel id="demo-simple-select-outlined-label">type</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label={Lang.staffs.packages.form.type}
                            name="type"
                            multiple
                            value={mpackage.type || []}
                            required
                            error={Validator.checkInput("type", mpackage)}
                            onChange={setData}
                        >
                            {/* <MenuItem value={"single"}>{Lang.staffs.packages.form.types.single}</MenuItem> */}
                            <MenuItem value={"weekly"}>{Lang.staffs.packages.form.types.weekly}</MenuItem>
                            <MenuItem value={"biweekly"}>{Lang.staffs.packages.form.types.biweekly}</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <Typography>
                        {Lang.staffs.packages.form.selected} {Lang.staffs.packages.form.types[mpackage.type]}
                    </Typography> */}
                </Grid>
                <Grid
                    item
                    className={classes.grid}
                    md={12}
                    xs={12}
                >
                    <TextField
                        fullWidth
                        label={Lang.staffs.packages.form.seo}
                        margin="dense"
                        name="seo"
                        type="text"
                        multiline
                        variant="outlined"
                        value={mpackage.seo}
                        onChange={setData}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    <FormControlLabel
                        control={<Checkbox name="checkedA" />}
                        label={Lang.staffs.packages.form.active}
                        checked={mpackage.active == 1}
                        onChange={() => {
                            setPackage({ ...mpackage, active: mpackage.active ? 0 : 1 });
                            setData();
                        }}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                >
                    {currentPackage ? null : (
                        <FormControlLabel
                            control={<Checkbox name="checkedA" />}
                            label={Lang.staffs.packages.form.can_renew}
                            checked={mpackage.can_renew == 1}
                            onChange={() => {
                                setPackage({ ...mpackage, can_renew: mpackage.can_renew ? 0 : 1 });
                                setData();
                            }}
                        />
                    )}
                </Grid>
            </Grid>
        </div>
    );
};


export default StaffPackageInfo;
