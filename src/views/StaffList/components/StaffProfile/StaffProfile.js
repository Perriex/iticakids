import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Avatar,
  MenuItem,
} from '@material-ui/core';
import axios from 'axios';
import store from 'store';
// import Ring from '@bit/joshk.react-spinners-css.ring';
import Lang from "../../../../Language";
import validator from "../../../../Validator";
import Autocomplete , { createFilterOptions }from '@material-ui/lab/Autocomplete';
import { withRouter } from 'react-router-dom';
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import DatePicker from "../../../../components/DatePicker";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 110,
    flexShrink: 0,
    flexGrow: 0
  },
  toRight : {
      float : "right"
  },
  fullwidth :{
      width : "100%",
  }
}));

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option.name,
});

const StaffProfile = (props) => {
  let { className ,isEdit , user, onUserInfoChange ,...rest} = props;
  const [user_info , setUser] = useState(user);
  const [showLoading , setLoadingState] = useState(false);
  const [is_admin , setIsAdmin] = useState(false);
  const [ countries , setCountries ] = useState([]);
  const [timezones , setTimezones ] = useState([]);

  React.useEffect(() => {
    setUser(user);
    validator.reset();
  } , [user]);
  React.useEffect(() => {
    setIsAdmin(user.id != store.get("user").id);
    getCountries();
    loadTimezones();
  } , [])
  const classes = useStyles();
  React.useEffect(() => {
    onUserInfoChange(user_info);
  } , [user_info])

  if(!user_info){
    setUser({});
  }

  const [image, setImage] = React.useState(user_info.avatar ? (typeof user_info.avatar == "string" ? axios.defaults.baseURL + user_info.avatar : user_info.avatar) : null);

  const imageSelectedHandler = e => {
    let avatar = e.target.files[0];
    setImage(e.target.files[0]);
    setUser({...user_info , avatar : avatar , no_avatar : false});
    // TODO this part can be deleted until end of this function. -------------------
    // because the avatar should be loaded from props, not state!
    var reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    // setImageName(e.target.files[0].name);
    reader.readAsDataURL(e.target.files[0]);
  };

  const removeImage = () =>{
    setUser({...user_info , no_avatar : true});
  }

  const getCountries = () => {
    // https://restcountries.eu/rest/v2/all
    axios.get("/api/getCountriesList").then(res => {
      // store.set("user" , res.data.data.user);
      setCountries(res.data);
      // store.set("token" , "Bearer " + res.data.data.token);
      // window.location.href = window.dashboard_url + "/account";
    }).catch(err => {
      // setLoadingState(false);
    })
  }

  const handleChange = event => {
    setUser({
      ...user_info,
      [event.target.name]: event.target.value
    });
  };


  const loadTimezones = () => {
    axios.get('api/timezones').then(res => {
        setTimezones(res.data);
    }).catch(err => {
        Toast(Lang.common.connection_error , "danger")
    })
  }

  const updateUser = (e) => {
    e.preventDefault();
    // let data = {
    //   name: user_info.name,
    //   family: user_info.family,
    // };
    let data = {...user_info};
    delete data.avatar;
    setLoadingState(true);
    if(user_info.birth_date) data.birth_date = user_info.birth_date;

    let url = "";
    var redirect = false;
    if(user_info.id == store.get("user").id){
      url = 'api/user/update';
    }else if(user_info.id == null ){
      url = 'api/admin/users/new';
      data.email = user_info.email;
      data.password = user_info.password;
      redirect = true;
    }else{
      url = 'api/admin/users/update';
      data.user_id = user_info.id;
    }
    

    axios.post(url, data).then(res => {
      if(res.data.data){
        Toast(Lang.common.success , "success");
        if(res.data.data.id == store.get("user").id){
          store.set("user" , res.data.data);
          setUser(res.data.data);
          window.location.href = window.dashboard_url + "/account";
        }
        setLoadingState(false);
      }
      if(redirect){
        // window.location.replace(window.dashboard_url + "/reports/users");
        props.history.replace(window.dashboard_url + "/reports/users");
      }
    }).catch(err => {
      
      Toast(Lang.common.connection_error , "danger");
      setLoadingState(false);
    });
  };


  const loginUser = () => {
    setLoadingState(true);
    let url = `api/admin/users/${user_info.id}/login`;
    axios.get(url).then(res => {
      store.set("user" , res.data.data.user);
      store.set("token" , "Bearer " + res.data.data.token);
      window.location.href = window.dashboard_url + "/account";
    }).catch(err => {
      setLoadingState(false);

    })
  }

  const getCurrentCountry = () => {
      let cat = countries.find(k => k.name == user_info.country);
      if(cat){
          return cat;
      }
      return {name : "" , id : null};
  }

    return(
        <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
        onSubmit={(e) => {if(validator.isFormValid()) updateUser(e); else e.preventDefault()} }
      >
        <CardHeader
          title={Lang.profile.title}
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={Lang.profile.form.name}
                margin="dense"
                name="name"
                error={validator.checkInput("name" , user_info)}
                onChange={handleChange}
                required
                value={user_info.name ? user_info.name : ""}
                variant="outlined"
              />
              <TextField
                fullWidth
                label={Lang.profile.form.family}
                margin="dense"
                name="family"
                error={validator.checkInput("family" , user_info)}
                onChange={handleChange}
                required
                value={user_info.family ? user_info.family : ""}
                variant="outlined"
              />
              <DatePicker 
                label={Lang.profile.form.birth_date}
                onChange={handleChange}
                name="birth_date"
                value={user_info.birth_date ? user_info.birth_date : ""}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
               <Avatar
                    className={classes.avatar}
                    src={image && !user.no_avatar ? image : (axios.defaults.baseURL + user.avatar)}
                />
                 <input onChange={imageSelectedHandler} style={{display: 'none'}} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                <label htmlFor="contained-button-file" className={classes.fullwidth}>
                <Button className={classes.toRight} color="primary" variant="text"  component="span">
                    {Lang.common.upload_pic}
                    {showLoading ? (
                    // <Ring size={20}/>
                    <></>
                    ) : null}
                </Button>
                </label>
                <Button className={classes.toRight} color="secondary" onClick={removeImage}>Remove Picture</Button>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                autoComplete="off"
                label={Lang.profile.form.email}
                margin="dense"
                type="email"
                name="email"
                error={(user.email != undefined) ? false : ((validator.checkInput("email" , user_info) || validator.checkEmail(user_info.email)))}
                disabled={isEdit}
                onChange={handleChange}
                required
                value={user_info.email ? user_info.email : ""}
                variant="outlined"
              />
            </Grid>
           
              <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={Lang.profile.form.password}
                margin="dense"
                name="password"
                required
                error={validator.checkInput("password" , user_info)}
                onChange={(e) => setUser({...user_info , password : e.target.value})}
                type="password"
                value={user_info.password ? user_info.password : ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
               <Autocomplete
                    value={getCurrentCountry()}
                    id="categories"
                    className={classes.marginBottom}
                    options={countries}
                    getOptionLabel={(option) => option.name ? option.name : ""}
                    fullWidth
                    autoComplete={false}
                    filterOptions={filterOptions}
                    onChange={(event, newValue) => {
                        setUser({...user_info , country : newValue ? newValue.name : ""})
                    }}
                    renderInput={(params) => <TextField {...params} autoComplete={false} label={Lang.profile.form.country} variant="outlined" />}
                />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={Lang.profile.form.city}
                margin="dense"
                name="city"
                onChange={handleChange}
                type="text"
                value={user_info.city ? user_info.city : ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <FormControl 
                fullWidth variant="filled" className={classes.formControl}>
                <InputLabel htmlFor="filled-age-native-simple">{Lang.profile.form.gender}</InputLabel>
                <Select
                  value={user_info.gender ? user_info.gender : ""}
                  defaultValue={user_info.gender ? user_info.gender : ""}
                  onChange={handleChange}
                  inputProps={{
                    name: 'gender',
                    id: 'filled-age-native-simple',
                  }}
                >
                  <MenuItem  value="" />
                  <MenuItem value={"0"}>{Lang.profile.form.male}</MenuItem>
                  <MenuItem value={"1"}>{Lang.profile.form.female}</MenuItem>
                </Select>
                <FormHelperText>{Lang.profile.form.current_gender}{user_info.gender != null ? (user_info.gender ? Lang.profile.form.female : Lang.profile.form.male) : Lang.profile.form.not_selected}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={Lang.profile.form.address}
                margin="dense"
                name="address"
                onChange={handleChange}
                type="text"
                multiline
                value={user_info.address ? user_info.address : ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={Lang.profile.form.phone_number}
                margin="dense"
                required
                name="phone_number"
                error={validator.checkInput("phone_number" , user_info)}
                onChange={handleChange}
                type="text"
                value={user_info.phone_number ? user_info.phone_number : ""}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={Lang.profile.form.skype_id}
                margin="dense"
                name="skype_id"
                onChange={handleChange}
                type="text"
                value={user_info.skype_id ? user_info.skype_id : ""}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}></Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                id="combo-box-demo"
                fullWidth
                options={timezones}
                required
                name="timezone"
                error={validator.checkInput("timezone" , user_info)}
                getOptionLabel={(option) => option.timezone}
                renderInput={(params) => <TextField {...params} name="timezone" label={Lang.reports.reserves.toolbar.timezone + " *"} variant="outlined" />}
                onChange={(event, newValue) => {
                    setUser({
                      ...user_info,
                      timezone : newValue.timezone
                    });
                }}
                />
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </div>
    )
}


export default withRouter(StaffProfile);