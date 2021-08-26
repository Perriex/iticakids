import React , { useState , forwardRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import {
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Paper,
} from '@material-ui/core';
import Lang from "../../../../Language"
import { Toast } from "../../../../config/ToastConfig/Toast.config"
import Loading from "../../../Loading"
import axios from "axios";
import placeholder from "../../../../assets/placeholder.png"

const CustomRouterLink = forwardRef((props, ref) => (
    <span
      ref={ref}
    >
      <RouterLink {...props} />
    </span>
  ));
  
const useStyles = makeStyles((theme) => ({
    root: {
      padding : theme.spacing(3)
    },
    add : {
        textAlign : "right"
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    space : {
        padding : theme.spacing(1)
    },
    media: {
      height: 200,
    },
  }));

const Staffs = (props) => {
    
    const [ showLoading , setLoadingState ] = useState(false)
    const [ rows , setRows ] = useState([]);
    const [ total , setTotal ] = useState({});
    const classes = useStyles();

    React.useEffect(() => {
        fetchData();
    } , []);

    const fetchData = () => {
        setLoadingState(true);
        axios.get(`api/admin/staffs`).then(res => {
            setLoadingState(false);
            setRows(res.data.data);
            let students = 0;
            let hours = 0;
            let pending = 0;
            res.data.data.forEach(row => {
                students += row.students;
                hours += row.hours;
                pending += row.pending;
            });
            setTotal({students : students , hours : hours ,pending : pending })
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        })
    }
    
    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading />
            ) : (
                <Grid container>
                    
                    <Grid item xs={12} className={classes.add}>
                    
                    <Button 
                    variant="contained" 
                    color="primary"
                    component={CustomRouterLink}
                    to={window.dashboard_url + "/staffs/new"}
                    >
                        New Staff
                    </Button>
                    </Grid>
                    <Grid item xs={12} md={12}  className={classes.space}>
                        <Paper  className={classes.root}>
                            <Grid container>
                                <Grid item xs={12} md={3}>
                                    <Typography>
                                        Students : {total.students}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography>
                                        Classes : {total.hours + total.pending}Hrs
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography>
                                        Completed : {total.hours}Hrs
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography>
                                        Pending : {total.pending}Hrs
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {rows.map((row , i) => {
                        return (
                            <Grid key={i} item xs={12} md={2} className={classes.space}>
                                <Card>
                                    <CardActionArea component={CustomRouterLink} to={window.dashboard_url + "/reports/users/"+row.user_id}>
                                    <CardMedia
                                        className={classes.media}
                                        image={row.avatar ? (axios.defaults.baseURL + row.avatar) : placeholder}
                                        title="Contemplative Reptile"
                                    />
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                        {row.name} {row.family}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Students : {row.students}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            )}
        </div>
    )
}


export default Staffs;