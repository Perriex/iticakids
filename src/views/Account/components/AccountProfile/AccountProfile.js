import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import axios from 'axios';
import store from 'store';
// import Ring from '@bit/joshk.react-spinners-css.ring';
import Lang from "../../../../Language";

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


const AccountProfile = props => {
  let { className , user, ...rest } = props;

  const [user_info , setUser] = React.useState(user);
  const [showLoading , setLoadingState] = React.useState(false);
  
  const classes = useStyles();
  React.useEffect(() => {
    setUser(user);
    setImage(user.avatar ? axios.defaults.baseURL + user.avatar : null);
  } , [user]);

  // if(!user_info){
  //   setUser({});
  // }

  const [image, setImage] = React.useState(user_info.avatar ? axios.defaults.baseURL + user_info.avatar : null);

  const imageSelectedHandler = e => {
    let avatar = e.target.files[0];
    setImage(e.target.files[0].name);
    updateUser(user.name, user.family, avatar);

    // TODO this part can be deleted until end of this function. -------------------
    // because the avatar should be loaded from props, not state!
    var reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    // setImageName(e.target.files[0].name);
    reader.readAsDataURL(e.target.files[0]);
  };

  const removeImage = () => {
    updateUser(user.name, user.family, user.avatar , true);
  }

  const updateUser = (name, family, avatar , no_avatar = false) => {
    // TODO Update user avatar!
    setLoadingState(true);

   

    let data = new FormData();
    data.append('name', name);
    data.append('family', family);
    data.append('avatar', avatar);
    if(no_avatar){
      data.append('no_avatar', no_avatar);
    }
    let url = "";
    if(user_info.id == store.get("user").id){
      url = 'api/user/update';
    }else{
      url = 'api/admin/users/update';
      data.append("user_id" , user_info.id);
    }

    axios.post(url, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'  // important in sending images
      }
    })
      .then(res => {
        if(res.data.data.id == store.get("user").id){
          store.set("user" , res.data.data);
          setUser(res.data.data);
        }
        window.location.reload()
        setLoadingState(false);
      })
      .catch(err => {
        setLoadingState(false);});
  };

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
              variant="h2"
            >
              {user.name}
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={image/* TODO Change this to get avatar from props! This is just for test*/}
          />
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <input onChange={imageSelectedHandler} style={{display: 'none'}} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
        <label htmlFor="contained-button-file">
          <Button className={classes.uploadButton} color="primary" variant="text"  component="span">
            {Lang.common.upload_pic}
            {showLoading ? (
              // <Ring size={20}/>
              <></>
            ) : null}
          </Button>
        </label>
        <Button color="secondary" component="span" variant="text" onClick={removeImage} className={classes.uploadButton} >{Lang.common.remove_pic}</Button>
      </CardActions>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
