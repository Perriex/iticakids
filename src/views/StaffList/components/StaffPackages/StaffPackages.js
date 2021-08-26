import React, { useState, forwardRef, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { NavLink as RouterLink } from 'react-router-dom';
import StaffPackageDeleteDialog from "../StaffPackageDeleteDialog";

import axios from "axios";
import {
    Card,
    CardContent,
    TextField,
    Divider,
    Typography,
    Table,
    TableBody,
    Grid,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    ListItemAvatar,
    ListItemText,
    ListItem,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AddIcon from "@material-ui/icons/Add"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import InfoIcon from "@material-ui/icons/Info"
import { makeStyles } from '@material-ui/styles';
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    marginTop: {
        marginTop: theme.spacing(1)
    },
    buttons: {
        display: 'flex',
        alignItems: 'center'
    },
    button: {
        marginLeft: 5
    },
    right: {
        marginLeft: "auto"
    },
    space: {
        padding: theme.spacing(1)
    }
}));
const rowsPerPage = 10;


const CustomRouterLink = forwardRef((props, ref) => (
    <span
        ref={ref}
        className={useStyles().right}
    >
        <RouterLink {...props} />
    </span>
));



const StaffPackages = props => {

    const { packages, staff_id, deletePackage, isProfile, is_owner } = props;
    const classes = useStyles();

    const [openDeleteDialog, setDeleteDialogState] = useState(false)
    const [current_staff_package, setCurrentStaffPackage] = useState(null);
    const [search, setSearch] = useState("");
    const [categories, setCats] = useState([]);
    const [category, setCategory] = useState("");
    const [durations, setDurations] = useState([]);
    const [duration, setDuration] = useState([]);

    React.useEffect(() => {
        let cats = [];
        let durations = [];
        packages.forEach(k => {
            if (k.package.countries && k.package.countries.length) {
                if (!cats.includes(k.package.countries[0].name)) {
                    cats.push(k.package.countries[0].name)
                }
            }

            if (!durations.includes(k.duration)) {
                durations.push(k.duration)
            }
        })
        setCats(cats);
        setDurations(durations);
    }, [])

    const setDeletePackage = (staff_pacakge) => {
        setCurrentStaffPackage(staff_pacakge);
        setDeleteDialogState(true);
    }

    const onDeleteDialogClose = (can_delete) => {
        if (can_delete) {
            if (deletePackage) {
                deletePackage(current_staff_package.id);
            }
        }
        setDeleteDialogState(false);
    }

    const filteredData = () => {
        let temp = [...packages];
        temp = temp.filter(k => k.package.name.includes(search));
        if (category) {
            temp = temp.filter(k => k.package.countries.find(k => k.name == category));
        }
        return temp;
    }

    return (
        <Fragment>
            {isProfile ? null : (
                <Card className={classes.marginTop}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12} md={3} className={classes.space}>
                                <TextField
                                    id="outlined-helperText"
                                    label={Lang.staff_booking.toolbar.search}
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => { setSearch(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} className={classes.space}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">{Lang.staff_booking.toolbar.category}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        onChange={(e) => { setCategory(e.target.value) }}
                                        label={Lang.staff_booking.toolbar.category}
                                    >
                                        <MenuItem value="">
                                            <em>-</em>
                                        </MenuItem>
                                        {categories.map((k, i) => {
                                            return (
                                                <MenuItem value={k}>{k}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3} className={classes.space}>
                                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">{Lang.staff_booking.toolbar.duration}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        onChange={(e) => { setDuration(e.target.value) }}
                                        label={Lang.staff_booking.toolbar.duration}
                                    >
                                        <MenuItem value="">
                                            <em>-</em>
                                        </MenuItem>
                                        {durations.map((k, i) => {
                                            return (
                                                <MenuItem value={k}>{k}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>

                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    component={CustomRouterLink}
                                    // onClick={() => onUserClick(user)}
                                    to={window.dashboard_url + "/invoices"}
                                >
                                    {Lang.staff_booking.toolbar.invoices}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
            <Card className={classes.marginTop}>
                <CardContent>
                    <Typography component="h5" variant="h5">
                        {Lang.staffs.packages.title}
                        {is_owner ? null : (
                            <Button
                                variant="contained"
                                color="primary"

                                startIcon={<AddIcon />}
                                component={CustomRouterLink}
                                // onClick={() => onUserClick(user)}
                                to={window.dashboard_url + "/staffs/" + staff_id + "/new"}
                            >
                                {Lang.staffs.packages.add}
                            </Button>
                        )}
                    </Typography>
                </CardContent>
                <StaffPackageDeleteDialog openDialog={openDeleteDialog} onDialogClosed={onDeleteDialogClose} current_staff_package={current_staff_package} />
                <Divider />
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{Lang.staffs.packages.list.package}</TableCell>
                                    <TableCell>{Lang.staffs.packages.list.category}</TableCell>
                                    <TableCell>{Lang.staffs.packages.list.dur}</TableCell>
                                    <TableCell>{Lang.staffs.packages.list.price}</TableCell>
                                    <TableCell>{Lang.staffs.packages.list.ir_price}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData().map(product => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={product.id}
                                    >
                                        <TableCell>
                                            <div className={classes.nameContainer}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt={product.package.name}
                                                            src={product.package.image ? axios.defaults.baseURL + product.package.image : null}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={product.package.name} />
                                                </ListItem>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.package.countries && product.package.countries.length ? product.package.countries[0].name : "-"}</TableCell>
                                        <TableCell>{product.duration}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.ir_price}</TableCell>
                                        <TableCell>
                                            {is_owner ? (
                                                <Tooltip title={Lang.staffs.packages.list.info}>
                                                    <IconButton
                                                        color="primary"
                                                        component={CustomRouterLink}
                                                        to={window.dashboard_url + "/staffBooking/" + product.id}
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <React.Fragment>
                                                    <Tooltip title={Lang.staffs.packages.list.info}>
                                                        <IconButton
                                                            color="primary"
                                                            component={CustomRouterLink}
                                                            to={window.dashboard_url + "/reports/staff/" + staff_id + "/staffBooking/"+product.id}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={Lang.common.edit}>
                                                        <IconButton
                                                            color="primary"
                                                            component={CustomRouterLink}
                                                            to={window.dashboard_url + "/staffs/" + staff_id + "/package/" + product.id}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={Lang.common.delete}>
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => setDeletePackage(product)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </React.Fragment>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </Card>
        </Fragment>
    );
};


export default StaffPackages;
