import React , {useState , forwardRef , Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
} from '@material-ui/core';
import axios from "axios";
import Loading from "../../../Loading"
import Lang from "../../../../Language"
import { NavLink as RouterLink } from 'react-router-dom';
import { Toast } from "../../../../config/ToastConfig/Toast.config"
import { InvoicesTable } from "./components"


const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
    >
      <RouterLink {...props} />
    </div>
  ));
  

const useStyles2 = makeStyles(theme => ({
    table: {
      minWidth: 500,
    },
    root : {
        padding : theme.spacing(3)
    },
    marginBottom: {
        marginBottom : theme.spacing(2)
    },
    right : {
        float : "right"
    }
  }));

export default function CustomPaginationActionsTable(props) {
    const classes = useStyles2();
    const [ staff_id ] = useState(props.match.params.staff_id);
    const [ type ] = useState(props.match.params.type);
    const [showLoading, setLoadingState] = React.useState(false);
    const [ user , setUser] = useState({});
    const [ rows , setRows ] = useState([]);


    React.useEffect(( ) => {
        loadInvoices();
    } , [])

    const loadInvoices = () => {
        setLoadingState(true);
        let data = {
            staff_id : staff_id,
            type : type
        }
        axios.get(`api/admin/reports/invoice` , {params : data}).then( res => {
            setUser(res.data.user);
            setRows(res.data.invoices);
            setLoadingState(false);
        }).catch( err => {
            Toast(Lang.common.connection_error , "danger")
            setLoadingState(false);
        })
    }


    return (
        <div className={classes.root}>
            {showLoading ? (
                <Loading />
            ) : (
                <Fragment>
                    <Grid container className={classes.marginBottom}>
                        <Grid item xs={12} md={2}  component={Paper}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={user.name}
                                        src={user.avatar ? axios.defaults.baseURL + user.avatar : null}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={user.name + " " + user.family} />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <Button 
                                color="primary"  
                                variant="contained" 
                                className={classes.right}
                                component={CustomRouterLink} 
                                to={window.dashboard_url + "/reports/financial/invoices/" + staff_id + "/" + type + "/new" }
                            >
                                {Lang.reports.invoices.new_invoice}
                            </Button>
                        </Grid>
                    </Grid>
                        <InvoicesTable rows={rows} type={type} />
                    </Fragment>
            )}
        </div>

    );
}
