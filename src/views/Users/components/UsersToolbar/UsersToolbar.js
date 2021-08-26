import React , {forwardRef , useState , Fragment} from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from "materialui-daterange-picker";
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import FilterIcon from "@material-ui/icons/FilterList";
import moment from "moment";
import { 
  Button , 
  FormControl,
  Select ,
  FormControlLabel , 
  Switch, 
  Grid ,
  InputLabel , 
  MenuItem , 
  TextField
} from '@material-ui/core';
import { SearchInput } from '../../../../components';
import Lang from "../../../../Language";
import axios from "axios";
import { Toast } from "../../../../config/ToastConfig/Toast.config"

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  add : {
    textAlign : "right"
  },
  spacer: {
    flexGrow: 1
  },
  padding : {
    padding : theme.spacing(1),
    display : "flex",
    justifyContent : "center"
    
  },
  marginTop : {
    marginTop : theme.spacing(1)
  },
  marginTop3 : {
    marginTop : theme.spacing(3)
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  floatContainer : {
      position : "absolute",
      float : "left"
  },
  floatItem : {
      position : "absolute"
  },
  button : {
    margin : theme.spacing(1)
  }
}));

const UsersToolbar = props => {
  const { className , onFilter , is_picker, ...rest } = props;

  const classes = useStyles();

  const columns = ["id" , "name" , "family" , "country" , "timezone", "created_at" , "is_active" , "email"];
  
  const [order_columns , setOrderColumns ] = useState(columns ? columns : []);
  const [search , setSearch] = useState("");
  const [openRangePicker , setRangePickerState] = useState(false);
  const [selectedColumn , setSelectedColumn] = useState("");
  const [selectedDir , setSelectedDir] = useState("");
  const [filter , setFilter] = useState({});
  const [selectedLength , setSelectedLength] = useState("");
  const [showStaff , setStaffState] = useState(false);
  const [ packages , setPackages ] = useState([]);
  const [ staff_package , setStaffPackage ] = useState(null);


  React.useEffect(() => {
    getPackages();
  } , []);

  const setOnFilter = ()=>{
    if(onFilter){
      onFilter(search , selectedColumn , selectedDir , showStaff , staff_package );
    }
  }


  const getPackages = () => {
    axios.get(`api/v1.0/staffs/getAll`).then(res => {
      setPackages(res.data.data);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger")
    })
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div>
        
          <div
              {...rest}
              className={clsx(classes.root, className)}
            >
              <Grid container>
                <Grid item xs={12} className={classes.add}>
                  
                  <Button 
                  variant="contained" 
                  color="primary"
                  component={CustomRouterLink}
                  to={window.dashboard_url + "/users/new"}
                  >
                    New User
                  </Button>
                </Grid>
                <Grid item xs={12} md={2} className={classes.padding}>
                  <SearchInput
                      className={classes.searchInput}
                      placeholder={Lang.filter.search}
                      value={search}
                      onChange={(e)=> setSearch(e.target.value)}
                  />
                </Grid>
                <Grid  item xs={12} md={2} className={classes.padding}>
                    <FormControl variant="outlined" fullWidth className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
                      <InputLabel id="demo-simple-select-outlined-label">{Lang.filter.column}</InputLabel>
                      <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label={Lang.filter.column}
                      value={selectedColumn}
                      onChange={(e) =>setSelectedColumn(e.target.value) }
                      >
                      <MenuItem value="">
                      </MenuItem>
                      {order_columns.map((k , i ) => {
                          return (
                              <MenuItem key={i} value={k}>{Lang.columns[k]}</MenuItem>
                          )
                      })}
                      </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2} className={classes.padding}>
                  <FormControl variant="outlined" fullWidth className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
                      <InputLabel id="demo-simple-select-outlined-label">{Lang.filter.dir}</InputLabel>
                      <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined2"
                      label={Lang.filter.dir}
                      value={selectedDir}
                      onChange={(e)=>setSelectedDir(e.target.value)}
                      >
                      <MenuItem value={"asc"}>{Lang.dir.asc}</MenuItem>
                      <MenuItem value={"desc"}>{Lang.dir.desc}</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} className={classes.padding}>
                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Packages</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      // value={age}
                      onChange={(e) => setStaffPackage(e.target.value)}
                      label="Packages"
                    >
                      <MenuItem ></MenuItem>
                      {packages.map((k , i) => {
                        return (
                        <MenuItem value={k.id} key={i}>{k.name + " " + k.family + " - " + k.package.package.name + " - " + k.package.duration + " " + Lang.common.minutes}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControlLabel
                    className={classes.marginTop3}
                    control={<Switch checked={showStaff == 1} onChange={() => {
                      setStaffState(!showStaff)
                      rest.setStaffState(!rest.showStaff)
                    }} name="" />}
                    label="Staffs"
                  />
                </Grid>
                <Grid item xs={12} md={2} className={classes.padding}>
                  <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<FilterIcon />}
                      onClick={setOnFilter}
                      >
                      {Lang.filter.filter}
                  </Button>
                </Grid>
              </Grid>
            </div>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersToolbar;
