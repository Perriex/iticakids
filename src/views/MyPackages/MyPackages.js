import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { PackageTable } from './components';
import axios from "axios";
import Loading from "../Loading";
import {withRouter} from  'react-router-dom';
import Lang from "../../Language";
import { Toast } from "../../config/ToastConfig/Toast.config";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  buttons : {
    border : "1px solid #eee",
    background : "#fff",
    marginBottom : theme.spacing(1)
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

const MyPackages = (props) => {
  const classes = useStyles();
  
  const [user_id ] = useState(props.match.params.user_id);
  const [products , setProducts] = useState([]);
  const [showLoading , setLoading ] = useState(true);
  const [paginate_info , setPaginateInfo] = useState({});
  const [showList , setShowListState ] = useState(true);

  React.useEffect(() => {
    if(user_id){
      getUserPackages(user_id);
    }else{
      getMyPackages()
    }
  } , []);

  const getMyPackages = (page) => {
    // TODO 'api/user/myPackages' -> myPackages
    axios.get('api/user/myPackages', {params : {page : page}}).then(res => {
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
      Toast(Lang.common.connection_error , "danger");
      setLoading(false);
    });
  };

  
  const setPage = (page) => {
    if(user_id){
      getUserPackages(user_id , page);
    }else{
      getMyPackages(page)
    }
  }

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <div>
          <PackageTable paginate={paginate_info} setPage={setPage} myPackages={products}/>
        </div>
      )}
    </div>
  );
};

export default withRouter(MyPackages);
