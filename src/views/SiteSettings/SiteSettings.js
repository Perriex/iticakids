import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    IconButton,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';
import axios from "axios";
import Loading from "../Loading";
import { Toast } from "../../config/ToastConfig/Toast.config";
import Lang from "../../Language";
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import Validator from "../../Validator";
import { Settings } from "./components"

const useStyles = makeStyles((theme) => ({
  root: {
      padding : theme.spacing(3)
  },
  space : {
      padding : theme.spacing(1)
  },
  marginBottom : {
      marginBottom : theme.spacing(2)
  }
}));

export default function Variants() {
    const classes = useStyles();

    const [ showLoading , setLoadingState ] = useState(true);
    const [ sites , setSites ] = useState([]);
    const [ site , setSite ] = useState(null);

    React.useEffect(() => {
        loadSites();
    } , [])

    const loadSites = () => {
        setLoadingState(true);
        axios.get(`api/admin/sites`).then(res => {
            setSites(res.data);
            setLoadingState(false);
        }).catch(err => {    
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        })
    }

    const selectSite = (site) => {
        setSite(site);
    }

    const newSite = () => {
        setSite({name : "" , url : "" , active : false});
    }
    
    const saveChanges = () => {
        if(!Validator.isFormValid('site')){
            return;
        }
        if(site.id){
            updateSite();
        }else{
            addSite();
        }
    }


    const updateSite = () => {
        setLoadingState(true);
        axios.post(`api/admin/${site.id}` , site).then(res => {
            loadSites();
            setLoadingState(false);
            Toast(Lang.common.success , "success");
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            
            setLoadingState(false);
        })
    }

    const addSite = () => {
        setLoadingState(true);
        axios.post(`api/admin/sites` , site).then(res => {
            loadSites();
            setLoadingState(false);
            Toast(Lang.common.success , "success");
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            
            setLoadingState(false);
        })
    }

    const saveSettings = (data) => {
        setLoadingState(true);
        axios.post(`api/admin/sites/${site.id}/settings` , data).then(res => {
            loadSites();
            setSite(null);
            Toast(Lang.common.success , "success");
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            
            setLoadingState(false);
        })
    }

    return (
        <div className={classes.root}>
        {showLoading ? (
            <Loading/>
        ) : (
            <div>
                 <Grid container>
                     <Grid item xs={12} md={site ? 4 : 12} className={classes.space}>
                        <Paper className={classes.root}>
                            <IconButton onClick={newSite}>
                                <AddIcon/>
                            </IconButton>
                            <List >
                                {sites.map((k , i) => {
                                    return (
                                        <ListItem
                                        button
                                        onClick={()=> {selectSite(k)}}
                                        >
                                            <ListItemText
                                                primary={k.name}
                                            />
                                            <ListItemSecondaryAction>
                                                <MenuIcon />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Paper>
                     </Grid>
                     {site ? (
                        <Grid item xs={12} md={8} className={classes.space}>
                            <Paper className={classes.root}>
                                <Typography component={"h3"} variant={"h3"} className={classes.marginBottom}>
                                    {site.name ? site.name : "New Site"}
                                </Typography>
                                <TextField
                                    id="outlined-helperText"
                                    label="site name"
                                    fullWidth
                                    variant="outlined"
                                    error={Validator.checkInput('name' , site, 'site')}
                                    value={site.name}
                                    className={classes.marginBottom}
                                    onChange={(e)=>setSite({...site , name : e.target.value})}
                                />
                                <TextField
                                    id="outlined-helperText"
                                    label="site url"
                                    helperText="https://example.com/"
                                    fullWidth
                                    variant="outlined"
                                    error={Validator.checkInput('url' , site, 'site')}
                                    value={site.url}
                                    onChange={(e)=>setSite({...site , url : e.target.value})}
                                    className={classes.marginBottom}
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={site.active == 1 } onChange={(e)=>setSite({...site , active : site.active ? 0 : 1})} name="Active" />}
                                    label="Active"
                                />
                                <Button variant="contained" onClick={saveChanges} color="primary">
                                  Save
                                </Button>
                            </Paper>
                        </Grid>
                     ) : null}
                    {site && site.id ? (
                         <Grid item xs={12} md={12}  className={classes.space}>
                            <Paper className={classes.root}>
                                <Settings settings={site.site_settings} onSave={saveSettings}/>
                            </Paper>
                        </Grid>
                    ) : null}
                 </Grid>

            </div>
        )}
        </div>
    );
}
