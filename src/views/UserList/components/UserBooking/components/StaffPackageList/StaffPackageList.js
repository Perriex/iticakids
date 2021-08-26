import React , {forwardRef , useState} from 'react';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { 
    Button,
    Card,
    CardContent,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
 } from '@material-ui/core';
import Loading from "../../../../../Loading";
import axios from "axios";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
  root: {
      margin: theme.spacing(3)
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  space: {
    margin : theme.spacing(2)
  },
}));

const StaffPackageList = props => {
  const { className , user_id, ...rest } = props;

  const classes = useStyles();
  const [showLoading , setLoading ] = useState(true);
  const [packages , setPackages] = useState([]);
  const [perPage] = useState(2);
  const [page , setPage] = useState(0);

  React.useEffect(() => {
    LoadPackages();
  } , [])

  const LoadPackages = () => {
    // TODO 'api/user/myPackages' -> myPackages
    axios.get('api/v1.0/staffs/getAll').then(res => {
      setLoading(false);
      setPackages(res.data.data);
    }).catch(err => {
      setLoading(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const handlePageChange = () => {
    setPage(page + perPage);
  }

  const handleRowsPerPageChange = (e) =>{
    
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
        {showLoading ? (
            <Loading />
        ) : (
            <Card
                {...rest}
                className={clsx(classes.root, className)}
                >
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5" className={classes.space}>
                        {Lang.Booking.list.title}
                    </Typography>
                    <PerfectScrollbar>
                    <div className={classes.inner}>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>{Lang.Booking.list.instructor}</TableCell>
                            <TableCell>{Lang.Booking.list.package}</TableCell>
                            <TableCell>{Lang.Booking.list.duration}</TableCell>
                            <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {packages.map(mPackage => (
                                <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={mPackage.id}
                                    >
                                        
                                        <TableCell>
                                        <div className={classes.nameContainer}>
                                            <Avatar
                                            className={classes.avatar}
                                            src={mPackage.avatar ? axios.defaults.baseURL + mPackage.avatar : null}
                                            >
                                            {mPackage.name}
                                            </Avatar>
                                            <Typography variant="body1">{mPackage.name + " " + mPackage.family}</Typography>
                                        </div>
                                        </TableCell>
                                        <TableCell>{mPackage.package.package.name}</TableCell>
                                        <TableCell>{mPackage.package.duration}</TableCell>
                                        <TableCell>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            component={CustomRouterLink}
                                            to={window.dashboard_url + "/reports/users/"+user_id+"/booking/new/"+mPackage.slug+"/"+mPackage.id}
                                        >
                                            {Lang.Booking.list.select}
                                        </Button>
                                        </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    </PerfectScrollbar>
                </CardContent>
                </Card>
        )}
    </div>
  );
};

export default StaffPackageList;
