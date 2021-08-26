import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Paper,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
} from '@material-ui/core';
import Editor from "../../../../components/Editor";
import axios from "axios";
import Loading from "../../../Loading";
import { withRouter } from 'react-router-dom';
import Validator from "../../../../Validator";
import { Toast } from "../../../../config/ToastConfig/Toast.config"
import Lang from "../../../../Language";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    }
}));

const SimplePaper = (props) => {

    const classes = useStyles();

    const [template_id] = useState(props.match.params.id ? props.match.params.id : null);
    const [showLoading, setLoadingState] = useState(false);
    const [c_template, setTemplate] = useState({});

    React.useEffect(() => {
        if (template_id) {
            loadTemplate();
        }
    }, [])

    const loadTemplate = () => {
        setLoadingState(true);
        axios.get(`api/admin/templates/notifications/${template_id}`).then(res => {
            setTemplate({ ...res.data, is_default: res.data.is_default == "1" ? true : false });
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error, "danger");
            setLoadingState(false);
        })
    }


    const updateTemplate = () => {
        setLoadingState(true);
        axios.post(`api/admin/templates/notifications/${template_id}`, c_template).then(res => {
            setLoadingState(false);
            Toast(Lang.common.success, "success");
            loadTemplate();
        }).catch(err => {
            Toast(Lang.common.connection_error, "danger");
            setLoadingState(false);
        })
    }
    const newTemplate = () => {
        setLoadingState(true);
        axios.post(`api/admin/templates/notifications`, c_template).then(res => {
            setLoadingState(false);
            Toast(Lang.common.success, "success");
            props.history.replace(window.dashboard_url + "/settings/templates");
        }).catch(err => {
            Toast(Lang.common.connection_error, "danger");
            setLoadingState(false);
        })
    }

    const saveTemplate = () => {
        console.log('c_template', c_template)
        if (!Validator.isFormValid()) {
            Toast(Lang.templates.form.error_title, "error");
            return;
        }

        if (!c_template.body) {
            Toast(Lang.templates.form.error_body, "error");
            return;
        }

        if (template_id) {
            updateTemplate();
        } else {
            newTemplate();
        }
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.root}>
                {showLoading ? (
                    <Loading />
                ) : (
                    <Grid container>
                        <Grid item xs={12} className={classes.marginBottom}>
                            <TextField
                                fullWidth
                                id="outlined-helperText"
                                label={Lang.templates.form.title}
                                variant="outlined"
                                value={c_template.title}
                                onChange={(e) => setTemplate({ ...c_template, title: e.target.value })}
                                error={Validator.checkInput("title", c_template)}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.marginBottom}>
                            <Editor model={c_template.body} onModelChange={(body) => { setTemplate({ ...c_template, body: body }) }} />
                            {c_template.is_default ? (
                                <Typography>
                                    {Lang.templates.form.default_hint}
                                </Typography>
                            ) : null}
                        </Grid>
                        <Grid>
                            <FormControlLabel
                                control={<Checkbox checked={c_template.is_default} onChange={(e) => setTemplate({ ...c_template, is_default: !c_template.is_default })} />}
                                label={Lang.templates.form.is_default}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.marginBottom}>
                            <Button variant="contained" color="primary" onClick={saveTemplate}>
                                {Lang.common.save}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </div>
    );
}


export default withRouter(SimplePaper);