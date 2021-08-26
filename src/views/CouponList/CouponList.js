import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { CouponToolbar, CouponsTable  } from './components';
import CouponDeleteDialog from "./components/CouponDeleteDialog";
import Loading from "../Loading";
import Lang from "../../Language";
import { Toast } from "../../config/ToastConfig/Toast.config";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const CouponList = () => {
  const classes = useStyles();

  const [coupons , setCoupons] = useState([]);
  const [openDeleteDialog , setDeleteDialogState] = useState(false);
  const [selectedCoupon , setSelectedCoupon] = useState(null);
  const [paginate_info , setPaginateInfo] = useState(null);
  const [filterData , setFilterData ] = useState({});
  const [showLoading , setLoading] = useState(true);

  React.useEffect(() => {
    fetchCoupns();
  } , []);

  const fetchCoupns = () =>{
    setLoading(true);
    filterCoupons();
  }

  const showDeleteDialog = (coupon)=>{
    setSelectedCoupon(coupon);
    setDeleteDialogState(true);
  }

  const onDeleteDialogClosed = (can_delete)=>{
    if(can_delete){
      deleteSpecificCoupon(selectedCoupon.id);
      
    }
    setDeleteDialogState(false);
  }

  const onCouponClick = (coupon)=>{
    
  }

  const getCoupons = (callback) => {
    // TODO 'api/admin/coupons' -> getCoupons
    axios.get(`api/admin/coupons`)
      .then(res => callback(res))
      .callback(err => {
        Toast(Lang.common.connection_error , "danger");
      });
  };



  const deleteSpecificCoupon = (coupon_id) => {
    // TODO `api/admin/coupons/{COUPON_ID}` -> deleteSpecificCoupon
    setLoading(true);
    axios.delete(`api/admin/coupons/${coupon_id}`)
      .then(res => {
        fetchCoupns();
        Toast(Lang.common.success , "success");
      })
      .catch(err => {
        setLoading(false);
        Toast(Lang.common.connection_error , "danger");
      });
  };

  const filterCoupons = (data) => {
    // TODO 'api/admin/coupons/filter -> filterCoupons
    axios.get('api/admin/coupons/filter', {params : data}).then(res => {
      setCoupons(res.data.data.data);
      setPaginateInfo(res.data.data);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const onFilter = (search, column, dir, length, callback)=>{
    const data = {
      search: search,
      column: column,
      dir: dir,
      length: length,
    };
    setFilterData(data);
    filterCoupons(data);
  }

  const setPage = (page)=> {
    
    filterCoupons({...filterData , page : page});
  }

  return (
    <div className={classes.root}>
      {showLoading ? (<Loading/>) : (
        <Fragment>
          <CouponToolbar onFilter={onFilter}/>
          <CouponDeleteDialog openDialog={openDeleteDialog} current_coupon={selectedCoupon} onDialogClosed={onDeleteDialogClosed}/>
          <div className={classes.content}>
            <CouponsTable coupons={coupons} setPage={setPage } paginate={paginate_info} onDeleteDialog={showDeleteDialog} couponInfoClick={onCouponClick}/>
          </div>
        </Fragment>
      )}
      
    </div>
  );
};

export default CouponList;


