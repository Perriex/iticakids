import React, { useState , Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";
import store from "store";
// import Ring from '@bit/joshk.react-spinners-css.ring';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControl,
} from '@material-ui/core';
import Lang from "../../../../Language";
import Loading from "../../../Loading";
import { Toast } from "../../../../config/ToastConfig/Toast.config"
import Validator from "../../../../Validator";
import MyDialog from "../../../Dialog";
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  space: {
    margin: theme.spacing(1)
  },
  grid_root: {
    padding: theme.spacing(2)
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  p1: {
    padding: theme.spacing(1)
  },
  content: {
    paddingTop: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  marginBottom : {
    marginBottom : theme.spacing(1)
  },
  time_bar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyItems: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
}));


const UserPermissions = props => {
  const classes = useStyles();

  const { user_info  , className , user_permissions} = props;

  const [ selectedPermissions, setUserPermissions ] = useState(user_permissions ? user_permissions : []);
  const [ showLoading , setLoadingState ] = useState(false);
  const [ permissions , setPermissions ] = useState([]);
  const [ roles , setRoles ] = useState([]);
  const [ role  , setRole ] = useState({});
  const [ newRole , setNewRole ] = useState(false);
  const [ openDeleteDialog , setDeleteDialogState ] = useState(false);
  React.useEffect(() => {
      fetchData();
  } , [user_permissions]);
  
  React.useEffect(() => {
    if(user_info){
      getUserRole();
    }
  } , [user_info]);


  const fetchData = () =>{
    setLoadingState(true);
    setUserPermissions(user_permissions ? user_permissions : []);
    getPermissions();
    getRoles();
  }
  
  const getPermissions = callback => {
    axios.get('api/admin/permissions').then(res =>{
      setPermissions(res.data.data);
      setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");

    });
  };
  
  const getRoles = callback => {
    axios.get('api/admin/roles').then(res =>{
      setRoles(res.data.data);
      setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error , "danger");

    });
  };
  
  const SaveRole = () => {
    if(!Validator.isFormValid("roles")){
      return;
    }
    if(!selectedPermissions.length){
      Toast("Please Select Permissions!" , "danger");
      return;
    }
    setLoadingState(true);
    let data = {
      name : role.name,
      permissions : selectedPermissions.map(k => {return k.slug})
    }
    axios.post('api/admin/roles' , data).then(res =>{
      fetchData();
      setRole({name : "" });
      setUserPermissions([]);
      setNewRole(false);
      Toast(Lang.common.success , "success");
    }).catch(err => {
      Toast(Lang.common.connection_error, "danger");
    });
  };

  const deleteRole = () => {
    setLoadingState(true);
    setDeleteDialogState(false);
    axios.delete(`api/admin/roles/${role.slug}`).then(res =>{
      fetchData();
      setRole({name : "" , slug : "" });
      Toast(Lang.common.success , "success");
    }).catch(err => {
      Toast(Lang.common.connection_error, "danger");
    });
  }
  
  const setAccess = (user_id, permissions = []) => {
    // TODO 'api/admin/users/setAccess' -> setAccess
    let data = {
      user_id: user_id,
      permissions: JSON.stringify(permissions.map(k=>{return k.slug})),
      role : role ? role.slug : null
    };
    axios.post('api/admin/users/setAccess', data).then(res => {
      setLoadingState(false);
      Toast(Lang.common.success , "success");
    }).catch(err => {
      setLoadingState(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const setUserPermission = (permission) => {
    if (selectedPermissions.find(k => k.id == permission.id)) {
      let index = selectedPermissions.findIndex(k => k.id == permission.id);
      delete selectedPermissions[index];
      setUserPermissions(selectedPermissions.filter(k => k != null));
    } else {
      setUserPermissions([...selectedPermissions, permission]);
    }
  };
  

  const savePermissions = () => {
    setLoadingState(true);
    setAccess(user_info.id , selectedPermissions);
  }

  const onRoleSelect = (role) => {
    setRole(role ? role : null)
    setUserPermissions(role ? role.permissions : [])
  }

  const defineNewRole = () => {
    setRole({name : "" , permissions : []});
    setUserPermissions([])
    setNewRole(!newRole);
  }

  const getUserRole = () => {
    if(user_info && user_info.roles){
      let roles = user_info.roles.filter(k => k.slug != "staff");
      if(roles.length){
        setRole(roles[0])
      }else{
        setRole({});
      }
    }
  }

  const isSiteAdmin = () => {
    let user = store.get("user");
    return user.permissions.find(k => k.slug == "site-manage");
  }

  return (
        <div className={clsx(!!user_info ? null : classes.root , className) }>
           {showLoading ? (
        <Loading/>
      ) : (
        <Card>
          <CardContent>
            <MyDialog 
            open_dialog={openDeleteDialog}
            msg="Delete Selected Role?"
            title={Lang.common.warning} 
            negative_btn={Lang.common.cancel}
            positive_btn={Lang.common.yes} 
            on_negative_btn={() => {setDeleteDialogState(false)}}
            on_positive_btn={deleteRole}
            />
            <Typography
              component="h5"
              variant="h5"
            >
              {Lang.users.permissions.title}
            </Typography>
            <Grid container>
              {!user_info ? (
                <Grid item xs={12} md={6}>
                  <Grid
                    container
                    >
                    {permissions.map((permission, i) => {
                      let show = false;
                      if(permission.protected == 1){
                        if(isSiteAdmin()){
                          show = true;
                        }
                      }else{
                        show = true;
                      }
                      return show ? (
                        <Grid
                          item
                          key={i}
                          md={4}
                          xs={12}
                        >
                          <FormControlLabel
                            control={<Checkbox checked={selectedPermissions.find(k => k.id == permission.id) != null}/>}
                            label={permission.name}
                            onChange={() => setUserPermission(permission)}
                          />
                        </Grid>
                      ) : null;
                    })}
                  </Grid>
                </Grid>
              ) : null}
                
              <Grid item xs={12} md={!user_info ? 6 : 12}>
                <FormControl variant="outlined" fullWidth className={classes.marginBottom}>
                  <InputLabel id="demo-simple-select-outlined-label">Roles</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={role ? role.slug : null}
                    onChange={(e) => {onRoleSelect(roles.find(k => k.slug == e.target.value))}}
                    label="Roles"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {roles.map((k , i) => {
                      return (
                      <MenuItem value={k.slug}>{k.name}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                {!!user_info ? null : (
                  <div className={classes.marginBottom}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={defineNewRole}
                      endIcon={<AddIcon/>}
                    >
                      New Role
                    </Button>
                    {!newRole && role != null && role.name ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        endIcon={<DeleteIcon/>}
                        onClick={() => {setDeleteDialogState(true)}}
                      >
                        Delete Role
                      </Button>
                    ) : null}
                  </div>
                ) }
                {newRole ? (
                  <Fragment>
                    <Divider className={classes.marginBottom}/>
                    <TextField
                        fullWidth
                        id="outlined-helperText"
                        label="Role Name"
                        helperText="Role name should be unique"
                        variant="outlined"
                        error={Validator.checkInput('name' , role , "roles")}
                        value={role ? role.name : null}
                        onChange={(e) => setRole({...role , name : e.target.value})}
                      />
                    {!selectedPermissions.length ? (
                      <Typography component={"h5"} className={classes.marginBottom}>
                        Don't forget to select permissions from permissions list
                      </Typography>
                    ) : null}
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.marginBottom}
                      onClick={SaveRole}
                    >
                      Save New Role
                    </Button>
                  </Fragment>
                ) : null}
              </Grid>
            </Grid>
            <Divider ligth="true"/>
            {!!user_info ? (
              <Button
                className={classes.button}
                color="primary"
                startIcon={<SaveIcon/>}
                variant="contained"
                onClick={savePermissions}
              >
                {Lang.common.save}
                {showLoading ? (
                  // <Ring size={20}/>
                  <></>
                ) : null}
              </Button>
            ) : null}
          </CardContent>
        </Card>
        )}
      </div>  
    );
};


export default UserPermissions;
