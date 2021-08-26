import React , {useState}from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import axios from "axios";
import Loading from "../../../Loading";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    space: {
      padding: theme.spacing(1)
    },
    inner: {
        maxHeight : "600px",
        overflow : "auto",
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

  
const PackagesList = props => {

    const {onPackageSelect } = props;

    const [packages , setPackages] = useState([]);
    const [selectedPackage , selectPackage] = useState([]);
    const [showLoading , setLoadingState ] = useState(true);

    const getPackages = (callback , error) => {
        axios.get('api/admin/packages').then(res => callback(res)).catch(err => {error(err)});
    };

    React.useEffect(()=>{
        getPackages(res => {
            setLoadingState(false);
            setPackages(res.data.data);
        } , () => {
            setLoadingState(false);    
            Toast(Lang.common.connection_error , "danger");
        });
    } , []);

    React.useEffect(() => {
        if(onPackageSelect){
            onPackageSelect(selectedPackage)
        }
    } , [selectedPackage])
  const classes = useStyles();

    return (
        <div>
            {showLoading ? (
                <Loading />
            ):(
                <div>
                    <Typography component="h5" variant="h5" className={classes.space}>
                        {Lang.staffs.packages.form.packages}
                    </Typography>
                    <PerfectScrollbar>
                        <div className={classes.inner}>
                            <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>{Lang.staffs.packages.form.list.select}</TableCell>
                                <TableCell>{Lang.staffs.packages.form.list.package}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {packages.map(mpackage => (
                                <TableRow
                                    className={classes.tableRow}
                                    hover
                                    key={mpackage.id}
                                    onClick={() => {
                                        console.log("selectedPackage" , selectedPackage);
                                        let index = selectedPackage.findIndex(k => k == mpackage.id);
                                        if(index == -1){
                                            selectPackage([...selectedPackage , mpackage.id]);
                                        }else{
                                            let temp = selectedPackage.filter( k => k != mpackage.id);
                                            selectPackage(temp);
                                        }
                                    }} 
                                >
                                    <TableCell>
                                        <FormControlLabel
                                            control={<Checkbox name="checkedA" checked={selectedPackage.find(k => k == mpackage.id)} />}
                                        />
                                    </TableCell>
                                    <TableCell>
                                    <div className={classes.nameContainer}>
                                        <Avatar
                                        className={classes.avatar}
                                        src={mpackage.image ? axios.defaults.baseURL + mpackage.image : null}
                                        >
                                        {mpackage.name}
                                        </Avatar>
                                        <Typography variant="body1">{mpackage.name}</Typography>
                                    </div>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                    </PerfectScrollbar>
                </div>
            )}
        </div>
        
    );
};


export default PackagesList;
