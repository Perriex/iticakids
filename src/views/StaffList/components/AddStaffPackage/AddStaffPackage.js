import React , {forwardRef , useState , Fragment}from 'react';
import { makeStyles } from '@material-ui/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import Loading from "../../../Loading";
import axios from "axios";
import {withRouter} from  'react-router-dom';
import {
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Divider
} from '@material-ui/core';
import Validator from "../../../../Validator";

import PackagesList from "../PackagesList";
import StaffPackageInfo from "../StaffPackageInfo";
import SaveIcon from "@material-ui/icons/Save";
import Lang from "../../../../Language";
import {Toast} from '../../../../config/ToastConfig/Toast.config';

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(4)
    },grid: {
        padding: theme.spacing(1)
    },
    inner: {
      minWidth: 1050
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

  
const AddStaffPackage = props => {

    
  const classes = useStyles();

  const [user , setUser] = useState(props.match.params.staff_id);

    // if(openDialog != open){
    //     setOpen(true);  
    // }
    const [mpackage , setPackage] = useState({});
    const [mpackage_id , setPackageId] = useState([]);
    const [showLoading , setLoading ] = useState(false);
    // const handleClickOpen = () => {
    //   setOpen(true);
    // };
    // const handleClose = () => {
    //     if(onDialogClosed){
    //         onDialogClosed();
    //     }
    //     setOpen(false);
    // };



    
  const defineNewStaffPackage = () => {
    setLoading(true);
    // TODO 'api/admin/staff-packages' -> defineNewStaffPackage
    let data = {...mpackage};
    data.user_id = user;
    data.package_id  = mpackage_id;
    data.ir_price = 0;
    data.active = Boolean(data.active) ? 1 : 0;
    data.can_renew = Boolean(data.can_renew) ? 1 : 0;

    axios.post(`api/admin/staff-packages`, data)
      .then(res => {
        setLoading(false);
        Toast(Lang.common.success , "success");
        props.history.push(window.dashboard_url + '/reports/users/'+ user)
      })
      .catch(err => {
        setLoading(false);
        Toast(Lang.common.connection_error , "danger");
      });
  };


    const onDataChanged = (_package) => {
        _package.json = JSON.stringify({seo : _package.seo});
        setPackage(_package);
    }

    const onPackageSelect = (package_id) => {
        setPackageId(package_id);
    }

    const savePackage = () => {
        defineNewStaffPackage();
    }

    return (
      <div className={classes.root}>
        <Button 
        variant="contained" 
        color="primary"
        component={CustomRouterLink}
        to={window.dashboard_url + "/reports/users/" + user}
        >
          Back
        </Button>
        <Card
            
            >
            {showLoading ? (
                <Loading/>
            ) : (
            <CardContent >
                <Typography component="h5" variant="h5" className={classes.flex}>
                    {Lang.staffs.form.title}
                </Typography>
                <Divider/>
                <Grid
                container
                >
                    <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                    >
                        <PackagesList onPackageSelect={onPackageSelect}/>
                    </Grid>
                    <Grid
                    item
                    className={classes.grid}
                    md={6}
                    xs={12}
                    >
                        <StaffPackageInfo onDataChanged={onDataChanged} />
                    </Grid>
                </Grid>
                <Grid
                item
                className={classes.grid}
                md={12}
                xs={12}
                >
                    
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={() => {
                          if(!mpackage_id){
                            Toast("no package selected");
                            return;
                          }
                          if(Validator.isFormValid() && mpackage_id){
                            savePackage();
                          }
                        }
                        }
                    >
                        {Lang.common.save}
                    </Button>
                </Grid>
            </CardContent>
            ) }
        </Card>
        </div>
    );
};



export default withRouter(AddStaffPackage);
