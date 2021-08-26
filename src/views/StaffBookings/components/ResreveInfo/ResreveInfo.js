import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Schedules from "../Schedules";
import axios from "axios";
import Loading from "../../../Loading";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import Lang from "../../../../Language";

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



const ResreveInfo = (props) => {
  const classes = useStyles();

  const [schedules , setSchedules] = useState([]);
  const [showLoading , setLoading ] = useState(true);
  const [reserve_id , setReserveId] = useState(props.match.params.reserve_id);
  const [staff_id , setStaffId] = useState(props.match.params.staff_id);
  const [paginate_info , setPaginateInfo] = useState({});
console.log(props.match.params)
  React.useEffect(() => {
    fetchData();
  } , []);


  const fetchData = () => {
    setLoading(true);
    getStaffSchedual(reserve_id);
  }

  const getStaffSchedual = (reserveId , page) => {
    let url = `api/staff/schedules/${reserveId}`
    if(staff_id){
      url+='?staff_id='+staff_id
    }
    axios.get(url , {params : {page : page}}).then((res) => {
      setSchedules(res.data.data.data);
      setPaginateInfo(res.data.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const setPage = (page) => {
    getStaffSchedual(reserve_id , page);
  }

  

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <Schedules paginate={paginate_info} refresh={fetchData} setPage={setPage} schedules={schedules}/>
      )}
    </div>
  );
};

export default ResreveInfo;
