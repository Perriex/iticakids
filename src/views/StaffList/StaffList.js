import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';

import { StaffsToolbar , StaffTable } from './components';
import Loading from "../Loading";
import axios from 'axios';
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

const StaffList = (props) => {
  const classes = useStyles();

  const {is_picker , onStaffPick} = props;

  const [users, setUsers] = useState([]);
  const [openActivateDialog , setActivateDialogState] = useState(false);
  const [selectedUser , setSelectedUser] = useState(null);
  const [ showLoading , setLoadingState] = useState(true);
  const [filterData , setFilterData] = useState([]);
  const [pagination_info , setPagination ] = useState({});

  
  const getStaff = callback => {
    // TODO 'api/staff/' -> getStaff
    axios.get('api/staff/').then(res => {
        
    }).catch(err => {

      Toast(Lang.common.connection_error , "danger");
    });
  };
  

  const updateSchedual = (schedualId, staffNote, userNote, userRating, userPresent, callback) => {
    // TODO 'api/staff/schedules/{SCHEDULE_ID}' updateSchedual
    const data = {
      staff_note: staffNote,
      user_note: userNote,
      user_rating: userRating,
      user_present: userPresent,
    };
    axios.post(`api/staff/schedules/${schedualId}`, data).then(res => callback(res)).catch(err => {
      
      Toast(Lang.common.connection_error , "danger");

    });
  };

  // --------------------- TODO Admin staff management part ------------------

  const getStaffs = () => {
    setLoadingState(true);
    // TODO 'api/admin/staffs' -> getStaffs
    axios.get('api/admin/staffs').then(res => {
      setUsers(res.data.data);
      setLoadingState(false);
    }).catch(err =>{
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };


  const deleteSpecificStaff = (staffSlug, callback , error) => {
    // TODO 'api/admin/staffs/{STAFF_SLUG}' -> deleteSpecificStaff
    axios.delete(`api/admin/staffs/${staffSlug}`).then((response) => {
      callback(response)
    
    }).catch(err => {
      error(err);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const filterStaff = (data) => {
    // TODO 'api/admin/staffs/filter' -> filterStaff
    // TODO 'api/admin/staffs' -> getStaffs
    axios.get('api/admin/staffs', {params : data}).then(res => {
      setUsers(res.data.data);
      setPagination(res.data.data);
      setLoadingState(false);
    }).catch(err =>{
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    });
  };

  // ------------------------- TODO Admin Staff Package Management ------------------------------

  const getStaffPackages = callback => {
    // TODO 'api/admin/staff-packages' -> getStaffPackages
    axios.get(`api/admin/staff-packages`)
      .then(response => callback(response))
      .catch(err => {
      Toast(Lang.common.connection_error , "danger");
      });
  };


  React.useEffect(() => {
    fetchData();
  } , []);

  const fetchData = () =>{
    setLoadingState(true);
    filterStaff();
  }

  const toggleActivate = (user)=>{
    setSelectedUser(user);
    setActivateDialogState(true);
  }

  const onActivateDialogClosed = ()=>{
    setActivateDialogState(false);
  }

  const onUserClick = (user)=>{

  }
  const onStaffDelete = (slug) => {
    setLoadingState(false);
    deleteSpecificStaff(slug , res => {
      fetchData();
      // getStaffs();
      Toast(Lang.common.success , "success");
    }, () => {
      // setLoadingState(true);
      Toast(Lang.common.connection_error , "danger");
    });
  }

  const onStaffFilter = (search , column , dir , length)=>{
    let data = filterData;
    data = {
      search: search,
      column: column,
      dir: dir,
      length: length
    };
    setFilterData(data);
    filterStaff(data);
  }

  const setPage = ( page) => {
    filterStaff({...filterData , page : page});
  }

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <StaffsToolbar onFilter={onStaffFilter}/>
          <div className={classes.content}>
            <StaffTable paginate={pagination_info} setPage={setPage} users={users} onStaffDelete={onStaffDelete} is_picker={is_picker} onStaffPick={onStaffPick} toggleActivate={toggleActivate} userInfoClick={onUserClick}/>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default StaffList;


