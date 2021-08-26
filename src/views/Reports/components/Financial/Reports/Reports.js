import React , { Fragment, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { FilterToolbar , ReportTable , Overview } from "./components";
import axios from "axios";
import { Toast } from "../../../../../config/ToastConfig/Toast.config"; 
import Lang from "../../../../../Language";
import Loading from "../../../../Loading";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative"
    },
    // dateModal:{
    //     position: "absolute",
    // }
}));
 
const Reports = props => {
  const { type } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [dateRange, setDateRange] = React.useState({});
  const [data , setData] = useState([]);
  const [ searchStaff , setSearchStaff ] = useState("");
  const [filteredData , setFilteredData ] = useState([]);
  const [overviewData , setOverviewData] = useState([]);
  const [selecteds , setSelecteds] = useState([]);
  const [showLoading , setLoadingState] = useState(true);
  const [ fileLink , setFileLink ] = useState("");

  React.useEffect(() => {
    fetchReports();
  } , []);

  

  const fetchReports = (filter ) => {
    setLoadingState(true);
    let reportData = {
      ...filter,
      type : type
    };
    axios.post('api/admin/reports' , reportData).then(res => {
      setData(res.data);
      setFilteredData(res.data);
      setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    })
  }
 

  const ExportReports = (filter , ext) => {
    setLoadingState(true);
    let reportData = {
      ...filter,
      type : type,
      ext : ext,
    };
    axios.post('api/admin/reports/export' , reportData).then(res => {
      window.location.href = axios.defaults.baseURL + res.data;
      
      Toast(Lang.common.success , "success");
      setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    })
  }
 
  const onSearch = (search) => {
    let temp = [...data];
    setFilteredData(temp.filter(k => (k.staff.name.toLowerCase() + " " + k.staff.family.toLowerCase()).includes(search.toLowerCase()) ));
  }

  const selected_rows =(rows) => {
    setSelecteds(rows);
  }

  const getOverviewdata = () => {
    if(selecteds.length){
      return filteredData.filter(k => selecteds.includes(k.staff.id))
    }else{
      return filteredData;
    }
  }

  return (
    <div className={classes.root}>
      <FilterToolbar onFilter={fetchReports} onExport={ExportReports} onSearch={onSearch}/>
      {showLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <ReportTable data={filteredData} type={type} selected_rows={selected_rows}/>
          <Overview data={getOverviewdata()}/>
        </Fragment>
      )}
    </div>
  );
}
 
export default Reports;