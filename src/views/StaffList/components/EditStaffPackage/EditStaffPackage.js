import React , {useState , forwardRef}from 'react';
import { makeStyles } from '@material-ui/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Loading from "../../../Loading";
import {
    Typography,
    Button,
    Card,
    CardContent,
    Divider
} from '@material-ui/core';
import StaffPackageInfo from "../StaffPackageInfo";
import SaveIcon from "@material-ui/icons/Save";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import Validator from "../../../../Validator";

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

  const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
      style={{ flexGrow: 1 }}
    >
      <RouterLink {...props} />
    </div>
  ));
  
const EditStaffPackage = props => {

    
  const classes = useStyles();

  const [currentPackage , setPackage] = useState({});//Get Staff Package usign api!
  const [newPackage , setNewPackage] = useState({});//Get Staff Package usign api!
  const [package_id , setPackageID] = useState(props.match.params.package_id);//Get Staff Package usign api!
  const [showLoading , setLoadingState] = useState(true);//Get Staff Package usign api!

  React.useEffect(() => {
    fetchData()
  } , []);

  const fetchData = () => {
    getSpecificStaffPackageInfo(package_id);
  }

  

  const getSpecificStaffPackageInfo = (staff_package_id) => {
    setLoadingState(true);
    // TODO 'api/admin/staff-packages/${staff_package_id}' -> getSpecificStaffPackageInfo
    axios.get(`api/admin/staff-packages/${staff_package_id}`)
      .then(res => {
        setLoadingState(false)
        let p = {...res.data.data};
        try {
          p.seo = JSON.parse(p.json).seo;
        } catch (error) {
          p.seo = "";
        }
        setPackage(p);
      })
      .catch(err => {
        Toast(Lang.common.connection_error , "danger");
        setLoadingState(false)
      });
  };

  
  const staffPackageUpdateInfo = (STAFF_PACKAGE_Id , data) => {
    // TODO 'api/admin/staff-packages/${STAFF_PACKAGE_Id}' -> staffPackageUpdateInfo
    setLoadingState(true)
    axios.post(`api/admin/staff-packages/${STAFF_PACKAGE_Id}`, data)
      .then(res => {
        // getSpecificStaffPackageInfo(STAFF_PACKAGE_Id)
        fetchData()
        Toast(Lang.common.success , "success");
      })
      .catch(err => {
        Toast(Lang.common.connection_error , "danger");
        setLoadingState(false)
      });
  };

  const savePackage = () => {
      let data = {...newPackage};
      console.log('data',data)
      data.ir_price = 0;
      data.package_id = currentPackage.package_id;
      data.staff_id = currentPackage.staff_id;
      data.json = JSON.stringify({seo : data.seo});
      staffPackageUpdateInfo(package_id , data);
  }
    // if(openDialog != open){
    //     setOpen(true);  
    // }

    // const handleClickOpen = () => {
    //   setOpen(true);
    // };
  
    // const handleClose = () => {
    //     if(onDialogClosed){
    //         onDialogClosed();
    //     }
    //     setOpen(false);
    // };

    const onDataChanged = (mpackage) => {
      setNewPackage(mpackage);
        // setPackage(mpackage);
    }
    return (
      <div 
      className={classes.root}>
      <Button 
      variant="contained" 
      color="primary"
      component={CustomRouterLink}
      to={window.dashboard_url + "/reports/users/" + props.match.params.staff_id}
      >
        Back
      </Button>
        <Card
            >
              {showLoading ? (
                <Loading />
              ) : (
                <CardContent >
                    <Typography component="h5" variant="h5" className={classes.flex}>
                        {Lang.staffs.packages.form.title}
                    </Typography>
                    <Divider/>
                    <StaffPackageInfo onDataChanged={onDataChanged} currentPackage={currentPackage} />
                  
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={() => {
                          if(Validator.isFormValid()){
                            savePackage()
                          }
                        }}
                    >
                        {Lang.common.save}
                    </Button>
                </CardContent>
              )}
        </Card>
        </div>
    );
};


export default EditStaffPackage;
