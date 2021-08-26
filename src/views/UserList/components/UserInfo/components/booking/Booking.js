import React , { useState }from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import {
    Table,
    TablePagination,
    Tooltip,
    Divider ,
    Grid,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    ButtonGroup,
    Button,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import DateRangeIcon from '@material-ui/icons/DateRange';
import UpdateIcon from '@material-ui/icons/Update';
import clsx from "clsx";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteIcon from '@material-ui/icons/Delete';
import HoldForUser from '@material-ui/icons/Timer';
import NotHoldIcon from '@material-ui/icons/AccessTime';
import HoldIcon from '@material-ui/icons/AccessTimeTwoTone';
import PlusIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
import TimesIcon from '@material-ui/icons/HighlightOffTwoTone';
import axios from "axios";
import Loading from "../../../../../Loading";
import moment from "moment";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";
import { withRouter } from "react-router-dom"
import store from "store";
import {
    KeyboardDateTimePicker,
} from '@material-ui/pickers';

const useRowStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    content : {
        padding : theme.spacing(2)
    },
    complete : {
        background : "#eee"
    },
    container : {
        display : "flex",
    },
    date_picker : {
        display : "flex",
        width : "500px",
        justifyContent: "center",
        alignContent: "flex-start",
        alignItems: "flex-end",
    },
    gift : {
        width : "150px",
        paddingLeft : "10px",
        paddingRight : "10px",
    }
  }));

const useSessionStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    date_picker : {
        display : "flex"
    },
    fullWidth : {
        width : "100%"
    },
    row : {
        height: "40px",
        overflow: "hidden",
        '& > *': {
            height: "40px",
            overflow: "hidden",
        },
    }
    ,
    user_chip : {
        background : "#4cc3f0",
        color : "white"
    },
    textLeft : {
        textAlign : "left"
    },
    button : {
        marginLeft : theme.spacing(1),
        marginTop : theme.spacing(1),
    },
    even : {
        background : "#eee",
    }
  }));

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
  };
}


function SessionRow(props) {
    const { row , session , events , number} = props;

    const classes = useSessionStyles();

    const [ showLoading , setLoadingState ] = useState(false);
    const [ sessions , setSessions ]  = useState(1);
    const [ available , setAvailable] = useState([]);
    const [ isReschedule , setIsReschedule ] = useState(false);
    const [ selectedDate , selectDate ] = useState(null);
    const [ is_gift , setIsGift ] = useState(false);

    React.useEffect(() => {
        // if(isReschedule){
        //     getTimes();
        // }
        selectDate(moment.utc(session.date).tz(getTimezone()).format("YYYY-MM-DD HH:mm"));
    } , [session]);

    // const getTimes = () => {
    //     let staff_slug = row.staff_package.staff.slug;
    //     let package_id = row.staff_package.id;

    //     setLoadingState(true);
    //     axios.post(`api/v1.0/staffs/${staff_slug}/${package_id}` , {pure : 1}).then(res => {
    //         setLoadingState(false);
    //         selectDate(null);
    //         setAvailable(res.data.data.available);
    //     }).catch(err => {
    //         setLoadingState(false);
    //         Toast(Lang.common.connection_error , "danger")
    //     })
    // }

    // const getAvailableList = () => {
    //     let list = [];
    //     for (var key in available) {
    //         if (available.hasOwnProperty(key)) {
    //         //key = date
    //         available[key].map(k => {
    //             list.push(key + " " + k);
    //         });
    //         }
    //     }
    //     return list;
    // }

    return (
        <TableRow className={number % 2 == 0 ? classes.even : null}>
            <TableCell className={classes.textLeft}>
                <Checkbox
                    defaultChecked
                    color="primary"
                    checked={session.hold == 1}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    onChange={() => events.onHold(row , session)}
                />
                <Button size="small" color="primary" onClick={() => events.onUserPresent(row , session)} disabled={session.user_present == 1} className={classes.button} variant="contained">
                    <CheckIcon/>
                </Button>
                <Button variant="contained"  size="small" onClick={() => events.onUserPresent(row , session)} disabled={session.user_present != 1} className={classes.button} color="secondary">
                    <ClearIcon/>
                </Button>
                <ButtonGroup className={clsx(classes.fullWidth , classes.row)}>
                    <Button>
                        {number}
                    </Button>
                    <Button>
                        <DateRangeIcon/>
                    </Button>
                    <FormControl variant="outlined" fullWidth className={clsx(classes.ml , classes.fullWidth)}>
                         <KeyboardDateTimePicker 
                            id="expire_at-local"
                            fullWidth
                            required
                            className={classes.row}
                            format="yyyy/MM/dd HH:mm"
                            inputVariant="outlined"
                            value={selectedDate ? moment(selectedDate).format("YYYY/MM/DD HH:mm") : moment().format("YYYY/MM/DD HH:mm")}
                            onChange={(e) => selectDate(e)}
                        />
                    </FormControl>
                    <Tooltip title="reschedule">
                        <Button onClick={() => {
                                    if(!selectedDate){
                                        return;
                                    }
                                    events.onReschedule(row , session , selectedDate)
                                }}>
                            <UpdateIcon/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Hold For User">
                        <Button onClick={() => events.onHoldForUser(row , session)}>
                                <HoldForUser color={session.user_hold == 1 ? "primary" : "default"}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="delete">
                        <Button   onClick={() => events.onDelete(row , session)}>
                            <DeleteIcon/>
                        </Button>
                    </Tooltip>
                </ButtonGroup>
                <Chip className={classes.user_chip} size="small" label={"User time : " + (moment.tz(selectedDate , getTimezone()).tz(row.timezone).format("YYYY-MM-DD HH:mm"))}/>
            </TableCell>
            {/* <TableCell>
                {number}
            </TableCell>
            <TableCell component="th" scope="row" >
                {moment.utc(session.date).tz(getTimezone()).format("YYYY-MM-DD HH:mm")}
                {isReschedule ? (
                   <div>
                        <div className={classes.date_picker}>
                            <FormControl variant="outlined" fullWidth className={clsx(classes.date_picker , classes.ml)}>
                                <TextField
                                    id="expire_at-local"
                                    label="Reschedule date"
                                    fullWidth
                                    type="datetime-local"
                                    required
                                    value={moment(selectedDate).format("YYYY-MM-DDTHH:mm")}
                                    onChange={(e) => selectDate(e.target.value)}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    variant="outlined"
                                />
                            </FormControl>
                            <IconButton color="primary" onClick={() => {
                                if(!selectedDate){
                                    return;
                                }
                                events.onReschedule(row , session , selectedDate)
                            }}>
                                <CheckIcon/>
                            </IconButton>
                        </div>
                        {selectedDate ? (
                            <div>
                                User time : {moment.tz(selectedDate , getTimezone()).tz(row.timezone).format("YYYY-MM-DD HH:mm")}
                            </div>
                        ) : null}
                   </div>
                   ) : null }
            </TableCell>
            <TableCell component="th" scope="row">
                {moment.utc(session.date).tz(row.timezone).format("YYYY-MM-DD HH:mm")}
            </TableCell>
            <TableCell>
                {session.hold == 1 ? (
                    <Chip color="primary"
                    onClick={() => events.onHold(row , session)}
                    label="Y"/>
                ) : (
                    <Chip color="secondary"
                    onClick={() => events.onHold(row , session)}
                    label="N"/>
                )}    
            </TableCell>
            <TableCell>
                {session.user_present == 1 ? (
                    <Chip color="primary"
                    onClick={() => events.onUserPresent(row , session)}
                    label="Y"/>
                ) : (
                    <Chip color="secondary" 
                    onClick={() => events.onUserPresent(row , session)}
                    label="N"/>
                )}    
            </TableCell>
            <TableCell align="right">
                <Tooltip title="Hold For User">
                    <IconButton
                    color={session.user_hold == 1 ? "danger" : "primary"}
                    onClick={() => events.onHoldForUser(row , session)}
                    >
                        {session.user_hold == 1 ? (
                            <HoldIcon/>
                        ) : (
                            <NotHoldIcon/>
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title="reschedule">
                    <IconButton
                    color="primary"
                    onClick={() => setIsReschedule(!isReschedule)}
                    >
                        <RescheduleIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="delete">
                    <IconButton
                    color="secondary"
                    onClick={() => events.onDelete(row , session)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </TableCell> */}
        </TableRow>
    )
}

const getTimezone = () => {
    return store.get("user").timezone;
}

function Row(props) {
    const { row , events } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const [ isCompleted , setIsCompleted ] = useState(false);
    const [ showNewSession , setNewSessionState ] = useState(false);
    const [ selectedDate , selectDate ] = useState(false);
    const [ is_gift , setIsGift ] = useState(false);
    const [ available , setAvailable ] = useState([]);
    const [ showLoading , setLoadingState ] = useState([]);

    React.useEffect(() => {
        if(row){
            setIsCompleted(row.schedules.filter(k => k.hold == 1).length == row.schedules_count);
        }
    } , [row])


    // React.useEffect(() => {
    //     if(showNewSession){
    //         getTimes();
    //     }
    // } , [showNewSession]);

    const getTimes = () => {
        let staff_slug = row.staff_package.staff.slug;
        let package_id = row.staff_package.id;

        setLoadingState(true);
        axios.post(`api/v1.0/staffs/${staff_slug}/${package_id}` , {pure : 1}).then(res => {
            setLoadingState(false);
            selectDate(null);
            setAvailable(res.data.data.available);
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger")
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
    
    return (
        <React.Fragment>
            <TableRow className={clsx(classes.root , isCompleted ? classes.complete : null)}>
                <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                {row.staff_package.package.name}
                </TableCell>
                <TableCell align="right">{row.schedules_count} sessions</TableCell>
                <TableCell align="right">{moment(row.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                <TableCell align="right">
                    <Tooltip title="Payment State">
                        <IconButton color="primary" onClick={() => events.onTogglePay(row)}>
                            {row.paid  == 1 ? (
                                <CheckIcon/>
                            ) : (
                                <TimesIcon/>
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton color="secondary" onClick={() => events.onDeleteReserve(row)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div className={classes.content}>
                        <Divider/>
                            <Grid container>
                                <Grid item className={classes.content}>
                                    <Chip 
                                        variant="outlined" 
                                        color="primary" 
                                        label={
                                            "Staff :" +  row.staff_package.staff.user.name + " " + row.staff_package.staff.user.family
                                        }/>
                                </Grid>
                                <Grid item className={classes.content}>
                                    <Chip variant="outlined" 
                                        color="primary" 
                                        label={"Duration : " + row.staff_package.duration + " " + Lang.common.minutes}
                                        />
                                </Grid>
                                <Grid item className={classes.content}>
                                    <Chip variant="outlined" 
                                        color="primary" 
                                        label={"Price : " + (row.currency == "USD" ? (row.price + " USD") : (row.ir_price + " IRT"))}
                                        />
                                </Grid>
                                <Grid item className={classes.content}>
                                    <Chip variant="outlined" 
                                        color="primary" 
                                        label={"Coupon : " + (row.coupon ? row.coupon : "none")}
                                    />
                                </Grid>
                                <Grid item className={classes.content}>
                                    <Chip variant="outlined" 
                                        color="primary" 
                                        label={"Off : " + row.off_percent + "%"}
                                        />
                                </Grid>
                                <Grid item className={classes.content}>
                                    <Chip variant="outlined" 
                                        color="primary" 
                                        label={"Timezone : " + row.timezone}
                                        />
                                </Grid>
                            </Grid>
                        <Divider/>
                        <Typography variant="h6" className={classes.content}>
                            <Tooltip title="New Session">
                                <IconButton color="primary" onClick={() => setNewSessionState(!showNewSession)}>
                                    <PlusIcon/>
                                </IconButton>
                            </Tooltip>
                            Sessions
                        </Typography>
                        {showNewSession ? (
                            <div>
                                <div className={classes.container}>
                                    <div className={classes.date_picker}>
                                        {/* <FormControl variant="outlined" fullWidth className={clsx(classes.picker , classes.ml)}>
                                            <InputLabel id="demo-simple-select-outlined-label">New Session date</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            label="New Schedule date"
                                            name="schedule_date"
                                            value={selectedDate}
                                            onChange={(e) => selectDate(e.target.value)}
                                            >
                                            <MenuItem value="">
                                            </MenuItem>
                                            {getAvailableList().map(k => {
                                                return (
                                                    <MenuItem value={k}>{k}</MenuItem>
                                                )
                                            })}
                                            </Select>
                                        </FormControl> */}
                                        <FormControl variant="outlined" fullWidth className={clsx(classes.date_picker , classes.ml)}>
                                             <KeyboardDateTimePicker 
                                                id="expire_at-local"
                                                label="New Schedule date"
                                                fullWidth
                                                format="yyyy/MM/dd HH:mm"
                                                className={classes.textField}
                                                inputVariant="outlined"
                                                value={selectedDate ? new Date(selectedDate) : new Date()}
                                                onChange={(e) => selectDate(e)}
                                            />
                                        </FormControl>
                                        <FormControlLabel
                                            className={classes.gift}
                                            control={<Checkbox checked={is_gift} onChange={() => setIsGift(!is_gift)}  />}
                                            label="Is Gift"
                                        />
                                        <IconButton color="primary" onClick={() => {
                                            if(!selectedDate){
                                                return;
                                            }
                                            events.onNewSchedule(row , selectedDate , is_gift)
                                        }}>
                                            <CheckIcon/>
                                        </IconButton>
                                    </div>
                                    {selectedDate ? (
                                        <div>
                                            User time : {moment.tz(selectedDate , getTimezone()).tz(row.timezone).format("YYYY-MM-DD HH:mm")}
                                        </div>
                                    ) : null}
                                </div>  
                            </div>
                        ) : null}
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {/* <TableCell>Date</TableCell>
                                <TableCell>User Date</TableCell>
                                <TableCell>Session Held</TableCell>
                                <TableCell>User Present</TableCell>
                                <TableCell></TableCell> */}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {row.schedules.map((session , i) => (
                                <SessionRow row={row} number={i + 1} session={session} key={i} events={events}/>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
    }

    Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            customerId: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
    };

    const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
    createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
    createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
    ];

    const Booking = (props) => {
        
    const [ user_id ] = useState(props.match.params.user_id);
    const [ showLoading , setLoadingState ] = useState(false);
    const [ showLilLoading , setLilLoadingState ] = useState(false);
    const [ rows , setRows ] = useState([]);
    const [ page , setPage ] = useState(0);


    React.useEffect(() => {
        setLoadingState(true);
        refresh();
    } , [])

    const refresh = () =>{
        loadReserves();
    }

    
    const deleteSchedule = (row , session) => {
        setLilLoadingState(true);
        let data = {
        user_id : row.user_id,
        schedule_id : session.id
        }
        axios.post(`api/admin/users/packages/${row.id}/delete_schedule` , data).then(res => {
        // window.location.reload(false);
        refresh();
        // setLoadingState(false);
        }).catch(err => {
        // refresh();
        Toast(Lang.common.connection_error , "danger")
        // window.location.reload(false);
        setLilLoadingState(false);
        });
    }

    const togglePresentState = (row , session) => {
        
        setLilLoadingState(true);
        let data = {
        user_id : row.user_id,
        schedule_id : session.id
        }
        axios.post(`api/admin/users/packages/${row.id}/toggle_present` , data).then(res => {
        // window.location.reload(false);
        refresh();
        // setLoadingState(false);
        }).catch(err => {
        // window.location.reload(false);
        // refresh();
        Toast(Lang.common.connection_error , "danger")
        setLilLoadingState(false);
        });
    }

    const togglePay = (row) => {
        setLilLoadingState(true);
        let data = {
        user_id : row.user_id
        }
        axios.post(`api/admin/users/packages/${row.id}/toggle_pay` , data).then(res => {
        // window.location.reload(false);
        refresh();
        // setLoadingState(false);
        }).catch(err => {
        // window.location.reload(false);
        // refresh();
        Toast(Lang.common.connection_error , "danger")
        setLilLoadingState(false);
        });
    }

    const toggleHoldState = (row , session) => {
        setLilLoadingState(true);
        let data = {
        user_id : row.user_id,
        schedule_id : session.id
        }
        axios.post(`api/admin/users/packages/${row.id}/toggle_hold` , data).then(res => {
        // window.location.reload(false);
        refresh();
        // setLoadingState(false);
        }).catch(err => {
        // window.location.reload(false);
        // refresh();
        Toast(Lang.common.connection_error , "danger")
        setLilLoadingState(false);
        });
    }

    const toggleUserHoldState = (row , session) => {
        setLilLoadingState(true);
        let data = {
        user_id : row.user_id,
        schedule_id : session.id
        }
        axios.post(`api/admin/users/packages/${row.id}/toggle_user_hold` , data).then(res => {
        // window.location.reload(false);
        refresh();
        // setLoadingState(false);
        }).catch(err => {
        // window.location.reload(false);
        // refresh();
        Toast(Lang.common.connection_error , "danger")
        setLilLoadingState(false);
        });
    }

    const deleteReserve = (row) => {
        setLilLoadingState(true);
        let data = {
          user_id : row.user_id
        }
        axios.post(`api/admin/users/packages/${row.id}/delete` , data).then(res => {
            refresh();
          // setLoadingState(false);
        }).catch(err => {
            // refresh();
            Toast(Lang.common.connection_error , "danger")
            setLilLoadingState(false);
        });
      }

    const rescheduleSession = (row , session , date) =>{
        let data = {
            schedule_id : session.id,
            reserve_id : session.reserve_id,
            schedule_date : date,
            user_id : row.user_id,
        };

        setLilLoadingState(true);
        axios.post(`api/admin/users/packages/${row.id}/reschedule` , data).then(res => {
            refresh();
            Toast(Lang.common.success, "success");
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLilLoadingState(false);
        })
    }

        
    const addNewSchedule = (row , date , is_gift) => {
    
        let data = {
            schedule_date : date,
            is_gift : is_gift,
        };
        data.user_id = row.user_id;
        data.timezone = row.timezone;
        data.staff_package_id = row.staff_package_id;
        setLilLoadingState(true);
        axios.post(`api/admin/users/packages/${row.id}/add_schedule` ,data ).then(res => {
        refresh();
        Toast(Lang.common.success , "success");
        }).catch(err => {
            setLilLoadingState(false);
        Toast(Lang.common.connection_error , "danger");
        })
    }
    
    const events = {
        onHold : toggleHoldState,
        onUserPresent : togglePresentState,
        onHoldForUser : toggleUserHoldState,
        onReschedule : rescheduleSession,
        onTogglePay : togglePay,
        onDeleteReserve : deleteReserve,
        onNewSchedule : addNewSchedule,
        onDelete : deleteSchedule,
    };

    const loadReserves = () =>{
        // setLoadingState(true);
        let data = {user_id : user_id};
        axios.post(`api/admin/users/packages` , {...data , params : page + 1 }).then(res => {
            setRows(res.data.data);
            setPage(res.data.current_page - 1);
            setLoadingState(false);
            setLilLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLilLoadingState(false);
            setLoadingState(false);
        }) ;
    }

    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadReserves();
    };
    
    return (
        <div>
            {showLoading ? (
                <Loading/>
            ) : (
                <div>
                    {showLilLoading ? (
                        <Loading height={50}/>
                    ) : null}
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Pakcage</TableCell>
                                <TableCell align="right">sessions</TableCell>
                                <TableCell align="right">booked on</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row , i) => (
                                <Row key={row.name} id={i} row={row} events={events} />
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                    labelRowsPerPage=""
                    rowsPerPageOptions={[20]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={20}
                    page={page}
                    onChangePage={handleChangePage}
                    />
                </div>
            )}
        </div>
    );
}


export default withRouter(Booking);