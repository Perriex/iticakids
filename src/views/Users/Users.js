import React, { useState ,useEffect , Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { UsersTable , UserActivateDialog } from '../UserList/components';
import { UsersToolbar } from './components';
import Loading from "../Loading";
import Dialog from "../Dialog";
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


const UserList = (props) => {
  const classes = useStyles();

  const {is_picker , onUserPick} = props;

  const [users, setUsers] = useState([]);
  const [openActivateDialog , setActivateDialogState] = useState(false);
  const [openStarDialog , setStarDialogState] = useState(false);
  const [selectedUser , setSelectedUser] = useState(null);
  const [showLoading , setLoadingState] = useState(true);
  const [filterData , setFilterData] = useState({});
  const [paginate_info , setPaginateInfo] = useState({});
  const [showStaff , setStaffState] = useState(false);

  const toggleActivate = (user)=>{
    setSelectedUser(user);
    setActivateDialogState(true);
  };

  const toggleStarred = (user)=>{
    setSelectedUser(user);
    setStarDialogState(true);
  };

  const onActivateDialogClosed = (state)=>{
    if(state != null){
      activateUser(selectedUser.id , state);
    }
    setActivateDialogState(false);
  };

  const onUserClick = (user)=>{
    
  };

  const getUsers = (callback) => {
    setLoadingState(true);
    // TODO 'api/admin/users/' -> getUsers -----> This works well
    axios.get('api/admin/users').then(res => {
      setLoadingState(false);
      callback(res);
    }).catch(err => {
      // getUsers(callback)
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    })
  };

  const getUser = (userId, callback) => {
    // 'TODO api/admin/users/{userId}' -> getUser
    axios.get(`api/admin/users/${userId}`).then(res => callback(res)).catch(err => {
      
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const getSpecificUserFullInfo = (userId, callback) => {
    // TODO 'api/admin/users/${userId}/full' -> getSpecificUserFullInfo
    axios.get(`api/admin/users/${userId}/full`).then(res => callback(res)).catch(err => {
      
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const filterUsers = (search, column, dir, page , showStaff ,staff_package ) => {
    // TODO 'api/admin/users/filter
    let data = filterData;
    data = {
      search: search,
      column: column,
      dir: dir,
      staff_package: staff_package,
      // showStaff : 2
      showStaff : showStaff ? 1 : 2
    };
    setFilterData(data);
    axios.get('api/admin/users/filter',  {params : {...data , page : page}}).then(res => {
      setUsers(res.data.data.data);
      setPaginateInfo(res.data.data);
      setLoadingState(false);
    }).catch(err => {
      // filterUsers(search, column, dir, length, page);
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    });
  };

  const newUser = (name, family, email, password, birth_date = null, avatar = null) => {
    // TODO 'api/admin/users/new' -> newUser
    let data = new FormData();
    data.append('name', name);
    data.append('family', family);
    data.append('email', email);
    data.append('password', password);
    if (birth_date) data.append('birth_date', birth_date);
    if (avatar) data.append('avatar', avatar);
    axios.post('api/admin/users/new', data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'  // important in sending images
      }
    }).then(res => {
      
      Toast(Lang.common.success , "success");
    }).catch(err => {
      
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const updateUser = (user_id, name, family, birth_date = null, avatar = null) => {
    // TODO 'api/admin/users/update' -> updateUser
    let data = new FormData();
    data.append('user_id', user_id);
    data.append('name', name);
    data.append('family', family);
    if (birth_date) data.append('birth_date', birth_date);
    if (avatar) data.append('avatar', avatar);
    axios.post('api/admin/users/new', data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'  // important in sending images
      }
    }).then(res => {}).catch(err => {
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const activateUser = (user_id, activate) => {
    // TODO 'api/admin/users/activate' -> activateUser
    setLoadingState(true);
    let data = {user_id: user_id, active: (activate ? 1 : 0)};
    axios.post('api/admin/users/activate', data).then(res => {
      fetchUsers();
      Toast(Lang.common.success , "success");
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    });
  };

  const starUser = (user_id, star) => {
    // TODO 'api/admin/users/activate' -> activateUser
    setLoadingState(true);
    setStarDialogState(false);
    let data = {user_id: user_id, star: (star ? 1 : 0)};
    axios.post('api/admin/users/star', data).then(res => {
      fetchUsers();
      Toast(Lang.common.success , "success");
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    });
  };


  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoadingState(true);
    filterUsers();
  }


  const onFilter = (search, column, dir, showStaff , staff_package) => {
    filterUsers(search, column, dir , null , showStaff , staff_package);
  }

  const setUserPage = (page) => {
    filterUsers(filterData.search , filterData.column , filterData.dir, page , filterData.showStaff , filterData.staff_package);
  }
  useEffect(()=>{
    filterUsers(filterData.search , filterData.column , filterData.dir, 0 , showStaff , filterData.staff_package);
  },[showStaff])
  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <UsersToolbar onFilter={onFilter} is_picker={is_picker} showStaff={showStaff} setStaffState={setStaffState}/>
          {is_picker ? '' : (
            <UserActivateDialog openDialog={openActivateDialog} user={selectedUser} onDialogClosed={onActivateDialogClosed}/>
          ) }
          <Dialog open_dialog={openStarDialog}
            msg={Lang.users.list.star_msg}
            title={Lang.common.warning}
            negative_btn={Lang.common.cancel}
            positive_btn={Lang.common.yes}
            on_negative_btn={() => {setStarDialogState(false)}}
            on_positive_btn={() => starUser(selectedUser.id , selectedUser.star ? 0 : 1)}
          />
          <div className={classes.content}>
            <UsersTable is_picker={is_picker} refresh={fetchUsers} is_manage={false} hideStar={true} paginate={paginate_info} setPage={setUserPage} onUserPick={onUserPick} users={users} toggleActivate={toggleActivate}  toggleStarred={toggleStarred} userInfoClick={onUserClick}/>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default UserList;


