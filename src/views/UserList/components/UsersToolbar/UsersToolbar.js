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
import {withRouter} from "react-router-dom";

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
  const [showStarred , setStarredState] = useState(window.location.hash == "#stars");

  React.useEffect(() => {
    setOnFilter();
  } , [])
  const setOnFilter = ()=>{
    if(onFilter){
      onFilter(search , selectedColumn , selectedDir , selectedLength , filter , showStarred);
    }
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        {is_picker ? '' : (
          <Fragment>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              component={CustomRouterLink}
              to={window.dashboard_url + "/templates"}
            >
              {Lang.users.send_msg}
            </Button>
          </Fragment>
        )}
      </div>
      <div>
          <div
              {...rest}
              className={clsx(classes.root, className)}
            >
              <Grid container>
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
                <Grid item xs={12} md={1} className={classes.padding}>
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
                <Grid item xs={12} md={2} className={classes.space}>
                    <TextField
                        fullWidth
                        id="outlined-helperText"
                        label="Date Range"
                        variant="outlined"
                        className={classes.marginTop}
                        onFocus={() => {setRangePickerState(true)}}
                        value={(filter.start_date ? filter.start_date : "-") + "/" + (filter.end_date ? filter.end_date: "-") }
                        />
                        {openRangePicker ? (
                          <div className={classes.floatContainer}>
                              <DateRangePicker
                                  className={classes.floatItem}
                                  open={openRangePicker}
                                  toggle={() => {setRangePickerState(false)}}
                                  onChange={(range) => {
                                      let start = moment(range.startDate).format("YYYY-MM-DD HH:mm");
                                      let end = moment(range.endDate).format("YYYY-MM-DD HH:mm");
                                      setFilter({...filter , start_date : start , end_date : end});
                                  }}
                                  />
                          </div>
                        ) : null}
                </Grid>
                <Grid item xs={12} md={2} className={classes.padding}>
                  <FormControl variant="outlined" fullWidth className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
                      <TextField
                          fullWidth
                          label={Lang.filter.length}
                          margin="dense"
                          name="length"
                          type="number"
                          value={selectedLength}
                          onChange={(e)=>setSelectedLength(e.target.value)}
                          required
                          variant="outlined"
                      />
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControlLabel
                    className={classes.marginTop3}
                    control={<Switch checked={showStarred == 1} onChange={() => {setStarredState(!showStarred)}} name="" />}
                    label="Show Starred"
                  />
                </Grid>
                <Grid item xs={12} md={1} className={classes.padding}>
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

export default withRouter(UsersToolbar);
