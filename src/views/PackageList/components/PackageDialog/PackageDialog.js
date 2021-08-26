import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Grid , Avatar , Typography , FormControlLabel ,Checkbox} from '@material-ui/core';
import axios from "axios";
import {PackageCountryPicker} from "../../components"
import Lang from "../../../../Language";
import validator from "../../../../Validator";
import Editor from "../../../../components/Editor";
import {Toast} from '../../../../config/ToastConfig/Toast.config';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3)
    },
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
      margin: "0 auto"
    },
    space : {
      padding : theme.spacing(1)
    },
    upload: {
        marginTop: 10
    },
    centerFlex: {
        display : "flex",
        flexDirection : "column",
        padding: 10
    }

  }));

const PackageDialog = props => {

    const classes = useStyles();

    let { openDialog , onDialogClosed , currentPackage, currentCountries} = props;
    const [open, setOpen] = React.useState(false);
    if(!currentPackage){
      currentPackage = {};
    }

    const [mpackage , setPackage] = React.useState(currentPackage ? currentPackage : {});
    const [image, setImage] = React.useState(currentPackage ? (axios.defaults.baseURL + currentPackage.image) : "");
    const [done , setDone] = React.useState(false);

    const [scroll, setScroll] = React.useState('paper');
    if(openDialog != open){
        setOpen(true);
    }


    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = (mpackage) => {
        if(onDialogClosed){
            onDialogClosed(mpackage);
        }
        setOpen(false);
        setDone(false);
    };

    if(mpackage != currentPackage && !done){
      setPackage(currentPackage);
      setImage((currentPackage.image ? axios.defaults.baseURL + currentPackage.image : null));
      setDone(true);
    }

    const onCountrySelected = (countries) => {
      setPackage({...mpackage , countries : countries.map(k => {return k.id})});
    }

    const imageSelectedHandler = e => {
      let avatar = e.target.files[0];

      if(!avatar){
        return;
      }

      setImage(e.target.files[0].name);
      setPackage({...mpackage , image : avatar, remove_image : 0})

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
      setPackage({...mpackage , image : "" , remove_image : 1});
    }

    return (
        <div>
        <Dialog
        open={open}
        onClose={() => handleClose()}
        scroll={scroll}
        maxWidth={"lg"}
        fullWidth
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{Lang.packages.form.title}</DialogTitle>
        <DialogContent
        className={classes.root}
        >

              <Grid
                container
                spacing={4}
                className={classes.root}

                >
                <Grid
                    item
                    md={8}
                    xs={12}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={Lang.packages.form.name}
                        type="text"
                        fullWidth
                        required
                        error={validator.checkInput("name" , mpackage)}
                        onChange={(e) => setPackage({...mpackage , name : e.target.value})}
                        value={mpackage.name}
                    />

                    <Typography component="h5" variant="h5" className={classes.space}>
                      {Lang.packages.form.text}
                    </Typography>
                    <Editor
                    model={mpackage.text}
                    onModelChange={(e) => setPackage({...mpackage , text : e})}
                    />
                    <TextField
                        margin="dense"
                        id="keywords"
                        label={Lang.packages.form.keywords}
                        type="text"
                        fullWidth
                        required
                        error={validator.checkInput("keywords" , mpackage)}
                        onChange={(e) => setPackage({...mpackage , keywords : e.target.value})}
                        value={mpackage.keywords}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label={Lang.packages.form.seo}
                        type="text"
                        fullWidth
                        onChange={(e) => setPackage({...mpackage , json : {seo : e.target.value}})}
                        value={mpackage.json ? mpackage.json.seo : ""}
                    />

<TextField
                margin="dense"
                id="name"
                label={Lang.packages.form.age}
                type="text"
                fullWidth
                onChange={(e) => {
                  setPackage({ ...mpackage, json: { ...mpackage.json, age: e.target.value } })
                }}
                value={mpackage.json ? mpackage.json.age : ""}
              />

              <TextField
                margin="dense"
                id="name"
                label={Lang.packages.form.language}
                type="text"
                fullWidth
                onChange={(e) => {
                  setPackage({ ...mpackage, json: { ...mpackage.json, language: e.target.value } })
                }}
                value={mpackage.json ? mpackage.json.language : ""}
              />
              
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                    className={classes.centerFlex}
                >

                    <Avatar
                        className={classes.large}
                        src={image}
                    />
                    <input onChange={(e) => {
                        imageSelectedHandler(e);
                    }} style={{display: 'none'}} accept="image/*" className={classes.input} id="test-contained-button-file" multiple type="file" />
                    <label htmlFor="test-contained-button-file">
                      <Button
                      className={classes.upload}
                      component="span"
                      color={"primary"}
                      variant="text"
                      >
                      {Lang.common.upload_pic}*
                      </Button>
                    </label>
                    {image ? (
                      <Button
                      className={classes.upload}
                      component="span"
                      color={"primary"}
                      variant="text"
                      onClick={removeImage}
                      >Remove Image</Button>
                    ) : null}
                    <PackageCountryPicker currentCountries={currentCountries} onSelected={onCountrySelected}/>
                    <FormControlLabel
                        control={<Checkbox checked={mpackage.visible == 1} onChange={(e) => setPackage({...mpackage , visible : e.target.checked ? 1 : 0 })} />}
                        label="Visible"
                    />
                </Grid>
              </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
          {Lang.common.cancel}
          </Button>
          <Button onClick={() => {
            if(!Boolean(mpackage.image) && !mpackage.remove_image){
              Toast("لطفا عکسی را انتخاب کنید!" , "error");
              return;
            }
            if(!Boolean(mpackage.text)){
              Toast("لطفا توضیحات را وارد کنید!" , "error");
              return;
            }
            if(validator.isFormValid()){
              handleClose(mpackage)
            }
            }} color="primary">
          {Lang.common.save}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
};


export default PackageDialog;
