import React, { useState , forwardRef} from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import InfoIcon from "@material-ui/icons/Info";
import { NavLink as RouterLink } from 'react-router-dom';
import { 
    Typography, 
    Card, 
    CardContent ,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Button,
    CardActions,
    TablePagination
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from "axios";
import Loading from "../../../Loading";
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    title: {
        padding: theme.spacing(1)
    },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
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

const AdminPackageReserves = (props) => {
  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [packages, setPackages] = useState([]);
  const [showLoading , setLoading  ] = useState(true);
  const [package_id  ] = useState(props.match.params.package_id);
  const [staff_id  ] = useState(props.match.params.staff_id);
  const [paginate_info , setPaginateInfo] = useState({});

  const handlePageChange = (event, page) => {
    getStaffReserves(staff_id,package_id , page + 1);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  
  React.useEffect(() => {
    getStaffReserves(staff_id , package_id);
  } , [])
  
  const getStaffReserves = (staffId,staffPackageId,page) => {
      setLoading(true);
    axios.get(`api/admin/staffs/${staffId}/reserves/${staffPackageId}` , {params : {page : page}}).then(res =>{
        setPackages(res.data.data.data);
        setPaginateInfo(res.data.data);
        setLoading(false);
    }).catch(err => {
        Toast(Lang.common.connection_error , "danger");
        setLoading(false);
    });
  };

  


  return (
    <div className={classes.root}>
        {showLoading ? (
            <Loading/>
        ) :(
        <Card
            className={clsx(classes.root)}
            >
            <CardContent className={classes.content}>
                <Typography component="h2" variant="h2" className={classes.title}>
                    {Lang.staff_booking.reserve.title}
                </Typography>
                <PerfectScrollbar>
                <div className={classes.inner}>
                    <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> {Lang.staff_booking.reserve.list.customer}</TableCell>
                            <TableCell>{Lang.staff_booking.reserve.list.coupon}</TableCell>
                            <TableCell>{Lang.staff_booking.reserve.list.price}</TableCell>
                            <TableCell>{Lang.staff_booking.reserve.list.ir_price}</TableCell>
                            <TableCell>{Lang.staff_booking.reserve.list.paid}</TableCell>
                            <TableCell>{Lang.staff_booking.reserve.list.date_ordered}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {packages.slice(0, parseInt(paginate_info.per_page)).map(mPakcage => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={mPakcage.id}
                        >
                            
                            <TableCell>{mPakcage.user.name + " " + mPakcage.user.family}</TableCell>
                            <TableCell>{mPakcage.coupon ? mPakcage.coupon : "-" }</TableCell>
                            <TableCell>{mPakcage.price} $</TableCell>
                            <TableCell>{mPakcage.ir_price} IRT</TableCell>
                            <TableCell>{mPakcage.paid ? (
                                <Chip label={Lang.staff_booking.reserve.list.paid} color="primary"/>
                            ) : (
                                <Chip label={Lang.staff_booking.reserve.list.not_paid} color="secondary"/>
                            )}</TableCell>
                            
                            <TableCell>{mPakcage.created_at}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<InfoIcon />}
                                    component={CustomRouterLink}
                                    // onClick={() => onUserClick(user)}
                                    to={window.dashboard_url + "/reports/staff/"+staff_id+"/staffBooking/"+mPakcage.staff_package_id+"/reserve/"+mPakcage.id}
                                >
                                    {Lang.staff_booking.reserve.list.info}
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                component="div"
                count={paginate_info.total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={paginate_info.current_page - 1}
                rowsPerPage={parseInt(paginate_info.per_page)}
                rowsPerPageOptions={[parseInt(paginate_info.per_page)]}
                />
            </CardActions>
            </Card>
        )}
    </div>
  );
};

export default AdminPackageReserves;
