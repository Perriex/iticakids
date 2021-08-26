import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Typography,
    Grid,
    Button,
    TextField,
    List,
    ListItem,
    Checkbox,
    ListItemText,
    ListItemIcon,
    AppBar,
    Tabs,
    Tab,
    Box,
    ListItemAvatar,
    Avatar,
    ListItemSecondaryAction,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { ColorPicker } from 'material-ui-color';
import placeholder from "../../../../assets/placeholder.png";
import MenuItems from "../../../../config/Menus";
import Emails from "../../../../config/Emails";
import axios from "axios";
import Editor from "../../../../components/Editor";
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    space: {
        padding: theme.spacing(1)
    },
    spacem: {
        margin: theme.spacing(1)
    },
    marginBottom: {
        marginBottom: theme.spacing(3)
    },
    media: {
        height: "auto",
        width: "100%",
        background: "#3333"
    },
    menuList: {
        maxHeight: "350px",
        overflow: "auto"
    },
    color_prev: {
        width: "24px",
        height: "24px",
        background: "#fff",
        borderRadius: "2px",
        display: "inline-block"
    },
    socials: {
        maxWidth: "350px",
    },
    flex: {
        display: "flex"
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

export default function SimplePaper(props) {
    const classes = useStyles();

    const { settings, onSave } = props;
    const defColors = {
        "primary-dark": "#c4996c",
        "primary-main": "#967737",
        "primary-light": "#f2d3a3"
    };
    const [image, setImage] = useState('')

    const [siteLogo, setSiteLogo] = useState(placeholder);
    const [siteTerms, setSiteTerms] = useState('');
    const [siteTitle, setSiteTitle] = useState('');
    const [siteTags, setSiteTags] = useState('');
    const [siteDesc, setSiteDesc] = useState('');
    const [welcomeEmail, setWelcomeEmail] = useState('');
    const [siteMenus, setSiteMenus] = useState([]);
    const [siteSocials, setSocials] = useState([]);
    const [newSocial, setNewSocial] = useState({});
    const [newSocialImg, setNewSocialImg] = useState({});
    const [siteEmails, setSiteEmails] = useState([]);
    const [siteEmail, setSiteEmail] = useState([]);
    const [siteLang, setSiteLang] = useState('');
    const [colors, setColor] = useState(defColors);

    const [colorPicker, setColorPicker] = useState(true);

    React.useEffect(() => {
        setColor(defColors);
        fillSettings();
    }, [settings])

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fillSettings = () => {
        let menu_result = [];
        let email_result = [];
        settings.forEach(setting => {
            switch (setting.slug) {
                case "terms":
                    setSiteTerms(setting.value);
                    break;
                case "lang":
                    setSiteLang(setting.value);
                    break;
                case "logo":
                    setSiteLogo(axios.defaults.baseURL + setting.value);
                    break;
                case "title":
                    setSiteTitle(setting.value);
                    break;
                case "support_email":
                    setSiteEmail(setting.value);
                    break;
                case "desc":
                    setSiteDesc(setting.value);
                    break;
                case "tags":
                    setSiteTags(setting.value);
                    break;
                case "welcome":
                    setWelcomeEmail(setting.value);
                    break;
                case "socials":
                    setSocials(JSON.parse(setting.value));
                    break;
                case "menus":
                    let menus = JSON.parse(setting.value)

                    menus.forEach(menu => {
                        let selected = MenuItems.find(k => k.slug == menu);
                        if (selected) menu_result.push(selected)
                    });
                    break;
                case "emails":
                    let emails = JSON.parse(setting.value);
                    emails.forEach(email => {
                        let selected = Emails.find(k => k.slug == email);
                        if (selected) email_result.push(selected)
                    });
                    break;
                case "colors":
                    let _colors = JSON.parse(setting.value);
                    setColor(_colors);
                    break;
                default:
                    break;
            }

        });

        setSiteMenus(menu_result);
        setSiteEmails(email_result);
    }

    const imageSelectedHandler = e => {
        let avatar = e.target.files[0];
        setImage(avatar);

        // TODO this part can be deleted until end of this function. -------------------
        // because the avatar should be loaded from props, not state!
        var reader = new FileReader();
        reader.onload = (e) => {
            setSiteLogo(e.target.result);
        };
        // setImageName(e.target.files[0].name);
        reader.readAsDataURL(e.target.files[0]);
    };

    const socialSelectedHandler = e => {
        let avatar = e.target.files[0];

        // TODO this part can be deleted until end of this function. -------------------
        // because the avatar should be loaded from props, not state!
        var reader = new FileReader();
        reader.onload = (e) => {
            setNewSocial({ ...newSocial, img: e.target.result });
        };
        // setImageName(e.target.files[0].name);
        reader.readAsDataURL(e.target.files[0]);
    };


    const isMenuChecked = (menu) => {
        return !!siteMenus.find(k => k.slug == menu.slug);
    }

    const checkMenu = (menu, add) => {
        let menus = [...siteMenus];
        if (add) {
            if (!menus.find(k => k.slug == menu.slug)) {
                menus.push(menu);
            }
        } else {
            menus = menus.filter(k => k.slug != menu.slug);
        }

        setSiteMenus(menus);
    }

    const isEmailChecked = (menu) => {
        return !!siteEmails.find(k => k.slug == menu.slug);
    }

    const checkEmail = (email, add) => {
        let emails = [...siteEmails];
        if (add) {
            if (!emails.find(k => k.slug == email.slug)) {
                emails.push(email);
            }
        } else {
            emails = emails.filter(k => k.slug != email.slug);
        }

        setSiteEmails(emails);
    }

    const onSavePress = () => {
        if (onSave) {
            let data = new FormData();
            if (image) {
                data.append("logo", image);
            }
            data.append("terms", siteTerms);
            data.append("title", siteTitle);
            data.append("tags", siteTags);
            data.append("desc", siteDesc);
            data.append("welcome", welcomeEmail);
            data.append("lang", siteLang);
            data.append("support_email", siteEmail);
            data.append("menus", JSON.stringify(siteMenus.map(k => { return k.slug; })));
            data.append("emails", JSON.stringify(siteEmails.map(k => { return k.slug; })));
            data.append("colors", JSON.stringify(colors));
            data.append("socials", JSON.stringify(siteSocials));

            onSave(data);
        }
    }

    const addSocial = () => {
        if (newSocial.img && newSocial.url) {
            let temp = [...siteSocials];
            temp.push(newSocial);
            setSocials(temp);
        }
    }

    const deleteSocial = (social) => {
        let temp = siteSocials.filter(k => k.url != social.url);
        setSocials(temp);
    }

    return (
        <div className={classes.root}>
            <Typography component="h2" variant="h2">
                Site Settings
            </Typography>
            <Grid container>
                <Grid item xs={12} md={9} className={classes.space}>
                    <FormControl required fullWidth variant="outlined" className={classes.marginBottom}>
                        <InputLabel id="demo-simple-select-required-label">Language</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={siteLang}
                            label="Language"
                            onChange={(e) => setSiteLang(e.target.value)}
                            className={classes.selectEmpty}

                        >
                            <MenuItem value={"en"}>English</MenuItem>
                            <MenuItem value={"fa"}>Persian</MenuItem>
                        </Select>
                    </FormControl>

                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Website Title" {...a11yProps(0)} />
                            <Tab label="Website Tags" {...a11yProps(1)} />
                            <Tab label="Website Description" {...a11yProps(2)} />
                            <Tab label="Website Terms" {...a11yProps(3)} />
                            <Tab label="Welcome Email" {...a11yProps(4)} />
                            <Tab label="Socials" {...a11yProps(5)} />
                            <Tab label="Website Email" {...a11yProps(6)} />

                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <TextField
                            id="outlined-number"
                            label="Website Title"
                            type="number"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            value={siteTitle}
                            rows={10}
                            onChange={(e) => { setSiteTitle(e.target.value) }}
                            variant="outlined"
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TextField
                            id="outlined-number"
                            label="Website Tags"
                            type="number"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            value={siteTags}
                            rows={10}
                            onChange={(e) => { setSiteTags(e.target.value) }}
                            variant="outlined"
                        />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <TextField
                            id="outlined-number"
                            label="Website Description"
                            type="number"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            value={siteDesc}
                            rows={10}
                            onChange={(e) => { setSiteDesc(e.target.value) }}
                            variant="outlined"
                        />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Editor
                            model={siteTerms}
                            onModelChange={(t) => setSiteTerms(t)}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Editor
                            model={welcomeEmail}
                            onModelChange={(t) => setWelcomeEmail(t)}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={5} className={classes.socials}>
                        <List className={classes.root}>
                            {siteSocials.map((social, i) => (
                                <ListItem key={i}>
                                    <ListItemAvatar>
                                        <Avatar src={social.img} />
                                    </ListItemAvatar>
                                    <ListItemText primary={social.url} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => deleteSocial(social)} aria-label="delete" color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                        <div className={classes.flex}>
                            <input onChange={socialSelectedHandler} style={{ display: 'none' }} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                            <label htmlFor="contained-button-file">
                                <Avatar src={newSocial.img} className={classes.spacem} />
                            </label>
                            <TextField id="outlined-basic" value={newSocial.url} className={classes.spacem} onChange={(e) => { setNewSocial({ ...newSocial, url: e.target.value }); }} label="url" variant="outlined" />
                            <IconButton className={classes.spacem} onClick={addSocial}>
                                <CheckIcon />
                            </IconButton>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        <TextField
                            id="outlined-number"
                            label="Website Email"
                            type="email"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={siteEmail}
                            onChange={(e) => { setSiteEmail(e.target.value) }}
                            variant="outlined"
                        />
                    </TabPanel>
                </Grid>
                <Grid item xs={12} md={3} className={classes.space}>
                    <img
                        className={classes.media}
                        src={siteLogo}
                    />
                    <input onChange={imageSelectedHandler} style={{ display: 'none' }} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                    <label htmlFor="contained-button-file">
                        <Button className={classes.uploadButton} color="primary" variant="text" component="span">
                            Select Logo
                        </Button>
                    </label>
                </Grid>
                {/* <Grid item xs={12} md={9} className={classes.space}>
                <Typography variant="h5" component="h5">
                    Emails
                </Typography>
                <Grid container>
                    {Emails.map((email , i ) => {
                        return (
                            <Grid item>
                                <ListItem key={i} dense button onClick={() => checkEmail(email , !isEmailChecked(email))}>
                                    <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        tabIndex={-1}
                                        disableRipple
                                        checked={isEmailChecked(email)}
                                    />
                                    </ListItemIcon>
                                    <ListItemText primary={email.name} />
                                </ListItem>
                            </Grid>     
                        )
                    })}
                </Grid>
            </Grid> */}
                <Grid item xs={12} md={9} className={classes.space}>
                    <Typography variant="h5" component="h5">
                        Colors
                    </Typography>
                    <Grid container>
                        <Grid className={classes.space}>
                            <Typography variant="h6" component="h6">
                                Primary Dark
                            </Typography>
                            <ColorPicker onChange={(color) => {
                                setColor({ ...colors, "primary-dark": "#" + color.hex })
                            }}
                                value={colors["primary-dark"]} />
                        </Grid>
                        <Grid className={classes.space}>
                            <Typography variant="h6" component="h6">
                                Primary Main
                            </Typography>
                            <ColorPicker onChange={(color) => {
                                setColor({ ...colors, "primary-main": "#" + color.hex })
                            }}
                                value={colors["primary-main"]} />
                        </Grid>
                        <Grid className={classes.space}>
                            <Typography variant="h6" component="h6">
                                Primary Light
                            </Typography>
                            <ColorPicker onChange={(color) => {
                                setColor({ ...colors, "primary-light": "#" + color.hex })
                            }}
                                value={colors["primary-light"]} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3} className={classes.space}>
                    <Typography variant="h5" component="h5">
                        Menus
                    </Typography>
                    <List className={classes.root} className={classes.menuList}>
                        {MenuItems.map((value, i) => {
                            const labelId = `checkbox-list-label-${value}`;
                            return (
                                <ListItem key={i} dense button onClick={() => checkMenu(value, !isMenuChecked(value))}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                            checked={isMenuChecked(value)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={value.name} />
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>

                <Grid item xs={12} className={classes.space}>
                    <Button variant="contained" color="primary" onClick={onSavePress}>
                        Save Settings
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
