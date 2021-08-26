import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { WorkshopsTable } from './components';
import axios from "axios";
import Loading from "../Loading";
import {withRouter} from  'react-router-dom';
import Lang from "../../Language"
import { Toast } from "../../config/ToastConfig/Toast.config"

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
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

const MyWorkshops = (props) => {
  const classes = useStyles();
  
  const [user_id ] = useState(props.match.params.user_id);
  const [products , setProducts] = useState([]);
  const [showLoading , setLoading ] = useState(true);
  const [paginate_info , setPaginateInfo] = useState({});

  React.useEffect(() => {
    if(user_id){
      getUserPackages(user_id);
    }else{
      getMyWorkshops()
    }
  } , []);

  const getMyWorkshops = (page) => {
    // TODO 'api/user/myPackages' -> myPackages
    axios.get('api/user/myWorkshops', {params : {page : page}}).then(res => {
      setLoading(false);
      setProducts(res.data.data);
      setPaginateInfo(res.data);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoading(false);
    });
  };

  const getUserPackages = (user_id , page) => {
    // TODO 'api/user/myPackages' -> myPackages
    let data = {
      user_id : user_id ,
      page : page
    }
    axios.post('api/admin/users/packages', data).then(res => {
      setLoading(false);
      setProducts(res.data.data);
      setPaginateInfo(res.data);
    }).catch(err => {
      setLoading(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const setPage = (page) => {
    if(user_id){
      getUserPackages(user_id , page);
    }else{
      getMyWorkshops(page)
    }
  }

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <WorkshopsTable paginate={paginate_info} setPage={setPage} myPackages={products}/>
      )}
    </div>
  );
};

export default withRouter(MyWorkshops);
