import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Grid , Avatar} from '@material-ui/core';
import Lang from "../../../../Language";
import validator from "../../../../Validator";
import { makeStyles } from '@material-ui/styles';
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  avatar: {
    margin: '0 auto',
    height: 110,
    width: 110,
    flexShrink: 0,
    flexGrow: 0
  },
  avatar_holder:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column"
  }
}))

const CountryAddDialog = props => {

    const classes = useStyles();

    const { openDialog , onDialogClosed , countryToEdit} = props;
    const [open, setOpen] = React.useState(false);
    const [country , setCountry ] = React.useState(countryToEdit);
    const [done , setDone] = React.useState(false);
    const [image , setImage] = React.useState("");

    if(openDialog != open){
        setOpen(true);
    }

    React.useEffect(() => {
      setCountry(countryToEdit);
      setImage(countryToEdit.image ? axios.defaults.baseURL + countryToEdit.image : null);
    } , [countryToEdit])

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = (name) => {
        if(onDialogClosed){
            onDialogClosed(name);
        }
        setOpen(false);
        setDone(false);
    };


   
  const imageSelectedHandler = e => {
    let avatar = e.target.files[0];
    setCountry({...country , image : avatar});
    setImage(e.target.files[0].name);
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

    return (
      <div>
        <Dialog open={open} onClose={() => handleClose()} fullWidth aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{Lang.countries.form.title}</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid 
              item
              md={4}
              xs={12}
              className={classes.avatar_holder}
              >
                <Avatar
                  className={classes.avatar}
                  src={image}
                />
                <input onChange={imageSelectedHandler} style={{display: 'none'}} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                <label htmlFor="contained-button-file">
                  <Button className={classes.uploadButton} color="primary" variant="text"  component="span">
                    {Lang.common.upload_pic}
                  </Button>
                </label>
              </Grid>
              <Grid
              item
              md={8}
              xs={12}
              >
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={Lang.countries.form.name}
                type="text"
                fullWidth
                required
                error={validator.checkInput("name" , country)}
                onChange={(e) => setCountry({...country , name : e.target.value})}
                value={country.name}
              />
              </Grid>
            </Grid>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
            {Lang.common.cancel}
            </Button>
            <Button onClick={() => {
              if(validator.isFormValid()){
                handleClose(country)
              }
            }} color="primary">
              {Lang.common.save}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};


export default CountryAddDialog;
