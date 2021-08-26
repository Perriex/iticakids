import React , {useState  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DateRangePicker } from "materialui-daterange-picker";
import {
    Grid,
    Paper ,
    TextField,
    Button,
    Divider,
    TableBody, 
    TableCell,
    Table,
    TableRow,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import moment from "moment";
import axios from "axios";
import Loading from "../../../../../Loading";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";
import StaffReportRow from "../StaffReportRow";
import placeholder from "../../../../../../assets/placeholder.png";
import PlusIcon from '@material-ui/icons/PlusOne';
import DeleteIcon from '@material-ui/icons/Delete';
import { withRouter } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 700,
    },
    root : {
        padding : theme.spacing(3)
    },
    floatContainer : {
        position : "absolute",
        float : "left"
    },
    floatItem : {
        position : "absolute"
    },
    marginTop : {
      marginTop : theme.spacing(3)
    },
    button : {
      marginLeft :  theme.spacing(1)
    },
    media : {
      height: "100%",
      width : "100%",
      maxheight : "200px",
      objectFit : "cover"
    },
    total_table : {
      maxWidth : 300,
    },
    borderRight : {
      borderRight : "1px solid #eee"
    }
  }));

const  InvoiceInfo = (props) => {
  const classes = useStyles();
  const [ filter , setFilter ] = useState({});
  const [ openRangePicker , setRangePickerState] = useState(false);

  const [ staff_id ] = useState(props.match.params.staff_id);
  const [ invoice_id ] = useState(props.match.params.invoice_id);
  const [ type ] = useState(props.match.params.type);
  const [ readOnly ] = useState(!staff_id);
  const [ showLoading , setLoadingState ] = useState(true);
  const [ row , setRow] = useState({});
  const [ invoiceImage , setInvoiceImage ] = useState('');
  const [ image, setImage] = React.useState("");
  const [ bills , setBills] = useState([]);
  const [ body  , setBody] = useState(""); 
  const [ USD_base  , setUSDbase] = useState(0); 
  const [ Total_USD , setTotalUSD] = useState(0);
  const [ Total_IRT , setTotalIRT] = useState(0);
  const [ calculated , setCalculated ] = useState(false)

  React.useEffect(() => {
    fetchInfo();
  } , [])


  const fetchInfo = () => {
    if(invoice_id){
      if(staff_id){
        loadSavedInvoce();
      }else{
        loadStaffReport();
      }
    }else{
      loadReport();
    }
  }

  const loadReport = () => {
    setLoadingState(true);
    let data = {
      ...filter ,
      staff_id : staff_id,
      type : type,
    };

    let url = `api/admin/reports/staff`;
    axios.post(url, data).then(res => {
      setRow(res.data);
      setLoadingState(false);
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");
    })
  }

  const loadStaffReport = () => {
    setLoadingState(true);

    let url = `api/staff/invoices/${invoice_id}`;
    axios.get(url).then(res => {
      setRow(JSON.parse(res.data.invoice_info));
      let filterData = {
        start_date : res.data.start_date,
        end_date : res.data.end_date
      };
      setFilter(filterData);
      setUSDbase(res.data.USD_base);
      setImage(res.data.image ? (axios.defaults.baseURL + res.data.image) : null);
      setBody(res.data.body);
      setBills(JSON.parse(res.data.bills));
      setTotalIRT(JSON.parse(res.data.total).irt);
      setTotalUSD(JSON.parse(res.data.total).usd);
      setCalculated(true)
      setLoadingState(false);
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");
    })

  }

  const loadSavedInvoce = () => {
    setLoadingState(true);
    
    let data = {
      ...filter ,
      staff_id : staff_id,
      type : type,
    };

    let url = `api/admin/reports/invoice/${invoice_id}` ;
    axios.get(url, {params : data}).then(res => {
      setRow(JSON.parse(res.data.invoice_info));
      let filterData = {
        start_date : res.data.start_date,
        end_date : res.data.end_date
      };
      setFilter(filterData);
      setUSDbase(res.data.USD_base);
      setImage(res.data.image ? (axios.defaults.baseURL + res.data.image) : null);
      setBody(res.data.body);
      setBills(JSON.parse(res.data.bills));
      setTotalIRT(JSON.parse(res.data.total).irt);
      setTotalUSD(JSON.parse(res.data.total).usd);
      setCalculated(true)
      setLoadingState(false);
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");
    })
  }

  const saveInvoice = () => {
    if(isNaN(invoice_id)){
      newInvoice();
    }else{
      updateInvoce();
    }
  }

  const newInvoice = () => {
    setLoadingState(true);
    let data = new FormData;
    data.append('type' , type);
    data.append('staff_id' , staff_id);
    data.append('invoice_info' , JSON.stringify(row));
    data.append('image' , invoiceImage);
    data.append('bills' , JSON.stringify(bills));
    data.append('body' , body);
    data.append('USD_base' , USD_base);
    data.append('total' , JSON.stringify({usd : Total_USD,irt : Total_IRT}));
    if(filter.start_date){
      data.append('start_date' , filter.start_date);
    }
    if(filter.end_date){
      data.append('end_date' , filter.end_date);
    }

    axios.post(`api/admin/reports/invoice` , data ).then(res => {
      setLoadingState(false);
      props.history.replace(window.dashboard_url + `/reports/financial/invoices/${staff_id}/${type}`);
      
      Toast(Lang.common.success, "success");
    }).catch(err => {
      
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    })
  }

  const updateInvoce = () => {
    setLoadingState(true);
    let data = new FormData;
    data.append('type' , type);
    data.append('staff_id' , staff_id);
    data.append('invoice_info' , JSON.stringify(row));
    if(invoiceImage){
      data.append('image' , invoiceImage);
    }
    data.append('bills' , JSON.stringify(bills));
    data.append('body' , body);
    data.append('USD_base' , USD_base);
    data.append('total' , JSON.stringify({usd : Total_USD,irt : Total_IRT}));
    if(filter.start_date){
      data.append('start_date' , filter.start_date);
    }
    if(filter.end_date){
      data.append('end_date' , filter.end_date);
    }

    axios.post(`api/admin/reports/invoice/${invoice_id}` , data ).then(res => {
      setLoadingState(false);
      fetchInfo();
      Toast(Lang.common.success , "success");
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");
    })
  }

  
  const imageSelectedHandler = e => {
    if(!e.target.files.length){
      return;
    }
    let avatar = e.target.files[0];
    setImage(e.target.files[0].name);
    setInvoiceImage(avatar);
    // updateUser(user.name, user.family, avatar);

    // TODO this part can be deleted until end of this function. -------------------
    // because the avatar should be loaded from props, not state!
    var reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    // setImageName(e.target.files[0].name);
    reader.readAsDataURL(e.target.files[0]);
  };

  const addBill = () => {
    let temp = [...bills];
    temp.push({});
    setBills(temp);
  }

  const removeBill = (index) => {
    let temp = [...bills];
    delete temp[index];
    temp = temp.filter(k => k !== null);
    setBills(temp);
  }

  const setBillData = (index , key , value) => {
    let temp = [...bills];
    temp[index][key] = value;
    setBills(temp);
  }

  const calculate = () => {
    if(!USD_base){
      Toast(Lang.reports.invoices.form.usd_to_irt_error , "danger");
      return;
    }
    let usd_income = row.usd_income;
    let irt_income = row.irt_income;

    bills.forEach(k => {
      if(!(k.amount && k.title)){
          return;  
      }
      switch (k.currency) {
        case "usd":
          usd_income += parseFloat(k.amount);
          break;
        case "irt":
          irt_income += parseFloat(k.amount);
        break;
      }
    })
    let to_usd = irt_income / USD_base + usd_income;
    let to_irt = usd_income * USD_base + irt_income;
    setTotalUSD(to_usd);
    setTotalIRT(to_irt);
    setCalculated(true);
  }
  const numberWithCommas = (nStr) =>  {
      // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
              x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
  }
  return (
    <div className={classes.root}>
        <Paper  className={classes.root}>
            <Grid container>
              <Grid item xs={12} md={3} >
                <TextField
                  fullWidth
                  id="outlined-helperText"
                  label={Lang.reports.invoices.form.date_range}
                  variant="outlined"
                  onFocus={() => { if(!readOnly)setRangePickerState(true)}}
                  value={(filter.start_date ? filter.start_date : "-") + "/" + (filter.end_date ? filter.end_date: "-") }
                  />
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
              </Grid>
              {readOnly ? null : (
                <Grid item xs={12} md={2}  >
                  <Button variant="contained" color="primary" className={classes.button} onClick={loadReport}>
                    {Lang.reports.invoices.form.filter}
                  </Button>
                </Grid>
              )}
            </Grid>
            {showLoading ? (
              <Loading />
            ) : (
              <div className={classes.marginTop}>
                <StaffReportRow row={row} />
                <Grid container  className={classes.marginTop}>
                  <Grid item xs={12} md={3}>
                   
                      <Table className={classes.total_table}>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={2} align="left">
                              {Lang.reports.invoices.form.total_staff_income}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell  align="left" className={classes.borderRight}>
                          {Lang.reports.invoices.form.usd}
                            </TableCell>
                            <TableCell  align="left">
                              {row.usd_income}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell  align="left"  className={classes.borderRight}>
                            {Lang.reports.invoices.form.irt}
                            </TableCell>
                            <TableCell  align="left">
                              {row.irt_income}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <TextField
                        id="outlined-helperText"
                        label={Lang.reports.invoices.form.usd_to_irt}
                        type="number"
                        variant="outlined"
                        value={USD_base}
                        onChange={(e) => {if(!readOnly)setUSDbase(e.target.value)}}
                        className={classes.marginTop}
                      />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Table>
                      <TableBody>
                        <TableRow >
                          <TableCell colSpan={4}>
                          {Lang.reports.invoices.form.extra_bills}
                          </TableCell>
                        </TableRow>
                        {bills.map((k , i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>
                                <TextField
                                  id="outlined-helperText"
                                  label={Lang.reports.invoices.form.title}
                                  fullWidth
                                  variant="outlined"
                                  value={bills[i].title}
                                  onChange={(e) => {if(!readOnly)setBillData(i , "title" , e.target.value)}}
                                />
                              </TableCell>
                                <TableCell>
                                  <TextField
                                    id="outlined-helperText"
                                    label={Lang.reports.invoices.form.amount}
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={bills[i].amount}
                                    onChange={(e) => {if(!readOnly)setBillData(i , "amount" , e.target.value)}}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">{Lang.reports.invoices.form.currency}</InputLabel>
                                    <Select
                                      labelId="demo-simple-select-outlined-label"
                                      id="demo-simple-select-outlined"
                                      label={Lang.reports.invoices.form.currency}
                                      disabled={readOnly}
                                      value={bills[i].currency}
                                      onChange={(e) => {setBillData(i , "currency" , e.target.value)}}
                                    >
                                      <MenuItem value="usd">{Lang.reports.invoices.form.usd}</MenuItem>
                                      <MenuItem value="irt">{Lang.reports.invoices.form.irt}</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  {readOnly ? null : (
                                    <IconButton color="primary" onClick={() => removeBill(i)} size="small"  component="span">
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </TableCell>
                            </TableRow>
                          )
                        })}
                        {readOnly ? null : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <IconButton color="primary" onClick={addBill} size="small" component="span">
                                <PlusIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item xs={12} md={2} className={classes.root}>
                    <div className={classes.details}>
                      <img
                        className={classes.media}
                        src={image ? image : placeholder}
                      />
                    </div>
                    <input onChange={imageSelectedHandler} style={{display: 'none'}} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                    {readOnly ? null : (
                      <label htmlFor="contained-button-file">
                        <Button className={classes.uploadButton} color="primary" variant="text"  component="span">
                          {Lang.reports.invoices.form.upload}
                        </Button>
                      </label>
                    )}
                  </Grid>
                </Grid>
                <Divider className={classes.marginTop}/>
                <Grid container>
                  <Grid item xs={12} md={4} className={classes.root}>
                    <Table >
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={2} align="left">
                          {Lang.reports.invoices.form.total}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell  align="left" className={classes.borderRight}>
                          {Lang.reports.invoices.form.to_usd}
                          </TableCell>
                          <TableCell  align="left">
                            {numberWithCommas(Total_USD)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell  align="left"  className={classes.borderRight}>
                          {Lang.reports.invoices.form.to_IRT}
                          </TableCell>
                          <TableCell  align="left">
                            {numberWithCommas(Total_IRT)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    {readOnly ? null : (
                      <div  className={classes.marginTop}>
                        <Button className={classes.button} color="primary" onClick={calculate} variant="contained"  component="span">
                        {Lang.reports.invoices.form.calculate}
                        </Button>
                        {calculated ? (
                          <Button className={classes.button} color="primary" onClick={saveInvoice} variant="contained"  component="span">
                            {Lang.common.save}
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}  className={classes.root}>
                    <TextField
                        id="outlined-helperText"
                        label={Lang.reports.invoices.form.des}
                        variant="outlined"
                        value={body}
                        fullWidth
                        multiline
                        rows={6}
                        onChange={(e) => { if (!readOnly)setBody(e.target.value)}}
                        className={classes.marginTop}
                      />
                  </Grid>
                  <Grid item xs={12} md={2}>
                  </Grid>
                </Grid>
              </div>
            )}
        </Paper>
    </div>
  );
}

export default withRouter(InvoiceInfo);