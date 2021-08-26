import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Divider,
  Button,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import store from 'store';
// import Ring from '@bit/joshk.react-spinners-css.ring';
import Lang from "../../../../Language";
import validator from "../../../../Validator";
import {Toast} from '../../../../config/ToastConfig/Toast.config';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 110,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));


const AccountPassword = props => {
  let { className , user, ...rest } = props;

  const [user_info , setUser] = React.useState(user);
  const [showLoading , setLoadingState] = React.useState(false);

  const classes = useStyles();
  React.useEffect(() => {
    setUser(user);
  } , [user]);

  const handleChange = event => {
    setUser({
      ...user_info,
      [event.target.name]: event.target.value
    });
  };

  const isOtherUser = () => {
      return user_info.id != store.get("user").id;
  }

  const changePassword = () => {
    setLoadingState(true);
    let url = 'api/user/change_password';
    if(isOtherUser()){
        url = 'api/admin/users/change_password';
    }
    let data = {
        password: user_info.password,
        user_id : user_info.id
    }
    axios.post(url, data).then(res => {
        Toast(Lang.profile.form.password_changed,"success");
        setLoadingState(false);
      }).catch(err => {
        setLoadingState(false);
        Toast(Lang.common.connection_error,"error");
      });
  }
  // if(!user_info){
  //   setUser({});
  // }
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
            <div>
                <Typography
                gutterBottom
                variant="h5"
                >
                    {Lang.profile.form.change_password}
                </Typography>
            </div>
        </div>
        <TextField
                fullWidth
                label={Lang.profile.form.password}
                margin="dense"
                required
                name="password"
                error={validator.checkInput("password" , user_info , "password_comp")}
                onChange={handleChange}
                type="password"
                value={user_info.password ? user_info.password : ""}
                variant="outlined"
              />
        <TextField
            fullWidth
            label={Lang.profile.form.conf_password}
            margin="dense"
            required
            name="conf_password"
            error={validator.equalTo("conf_password" , "password" , user_info)}
            onChange={handleChange}
            type="password"
            value={user_info.conf_password ? user_info.conf_password : ""}
            variant="outlined"
            />
      </CardContent>
      <Divider />
      <CardActions>
          <Button className={classes.uploadButton} 
          color="primary" 
          variant="text"
          component="span"
          onClick={()=> {if(validator.isFormValid("password_comp") && user_info.password){ changePassword()} else return}}
          >
            {Lang.common.change}
            {showLoading ? (
              // <Ring size={20}/>
              <></>
            ) : null}
          </Button>
      </CardActions>
    </Card>
  );
};

export default AccountPassword;
