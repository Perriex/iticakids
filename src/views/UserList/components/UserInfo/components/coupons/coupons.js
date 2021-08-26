import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import Lang from "../../../../../../Language"
import Loading from "../../../../../Loading"
import { withRouter } from "react-router-dom"
import axios from "axios";
import DeleteIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import {Toast } from "../../../../../../config/ToastConfig/Toast.config"


const useStyles = makeStyles((theme) => ({
  root: {
      padding : theme.spacing(3)
  },
  button : {
      marginTop : theme.spacing(1),
      marginLeft : theme.spacing(1),      
  },
  space : {
      padding : theme.spacing(2)
  }
}));

function Coupons(props) {
    const classes = useStyles();
    const [ user_id ] = useState(props.match.params.user_id);
    const [ showLoading , setLoadingState ] = useState(false);
    const [ openCoupons , setOpenCoupens ] = useState([]);
    const [ coupon , setCoupon ] = useState(null);
    const [ coupons , setCoupons ] = useState([]);

    React.useEffect(() => {
        refresh();
    } , [])


    const refresh = () => {
        getCoupons();
        getUserCoupons();
    }

    const getCoupons = () => {
        setLoadingState(true);
        axios.get(`api/admin/coupons/users`).then(res => {
            setOpenCoupens(res.data.data);
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
    }

    const getUserCoupons = () => {
        setLoadingState(true);
        axios.get(`api/admin/coupons/users/${user_id}`).then(res => {
            setCoupons(res.data);
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
    }

    const attachToUser = () => {
        if(!coupon){
            return;
        }
        setLoadingState(true);

        let data = {
            coupon_id : coupon,
            user_id : user_id,
        }

        axios.post(`api/admin/coupons/users` , data).then(res => {
            refresh();
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
    }

    const detachUserCoupon = (coupon_id) => {
        setLoadingState(true);

        axios.delete(`api/admin/coupons/users/${user_id}/${coupon_id}`).then(res => {
            refresh();
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
    }

    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading/>
            ) : (
                <Grid container>
                    <Grid item xs={12} md={12} className={classes.space}> 
                        <Typography variant="h5">
                            Available Coupons
                        </Typography>
                        <FormControl variant="outlined" fullWidth className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Coupons</InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={(e) => setCoupon(e.target.value)}
                            label="Coupons"
                            >
                            <MenuItem value=""></MenuItem>
                            {openCoupons.map(k => {
                                return (
                                    <MenuItem value={k.id}>{k.code} - {k.type}</MenuItem>
                                )
                            })}
                            </Select>
                        </FormControl>
                        <Button color="primary" variant="contained" onClick={attachToUser} className={classes.button}>
                            Attach To User
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={12} className={classes.space}>
                        {coupons.length ? (
                            <div>
                                <Typography variant="h5">
                                    User's Attached Coupons
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>Code</TableCell>
                                        <TableCell align="right">Type</TableCell>
                                        <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {coupons.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="right">{row.code}</TableCell>
                                            <TableCell align="right">{row.type}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="detach coupon">
                                                    <IconButton color="secondary" onClick={()=> detachUserCoupon(row.id)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        ) : (
                            <Typography variant="h5">
                                No Attached Coupons!
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            )}
        </div>
    );
}


export default withRouter(Coupons);