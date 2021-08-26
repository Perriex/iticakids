import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './NavMenu.module.scss';
import {NavLink, Link} from "react-router-dom";
import Button from "../Button/Button";
import {Button as MUIButton} from '@material-ui/core';
import logo from "../../assets/general/kids-logo.png";
import close from "../../assets/general/close.svg";
import {withRouter} from 'react-router-dom';
import store from 'store';
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import {Toast} from "../../config/ToastConfig/Toast.config";
import {getColorOfIndex} from "../../constants/js/functions";
import {strings} from "../../constants/js/strings";

const NavMenu = props => {
    const buttonStyle = {
        float: 'right',
        margin: '0 10px 0 0',
        padding: '0 10px',
        backgroundColor: '#F49401',
        borderRadius: 0,
        height: 40,
        color: '#FFFFFF'
    };
    const handleClose = e => {
        e.stopPropagation();
        props.onClose();
    };

    const user = store.get('user');
    const token = store.get('token');
    const signedIn = !!user && !!token;

    const handleLogOut = () => {
        store.remove('user');
        store.remove('token');
        handleDialogClose();
        Toast('You logged out from your Account.', 'info');
        window.location.reload();
    };

    const [open, setOpen] = React.useState(false);

    const handleDialogOpen = () => {
        props.onClose();
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleGotoDashboard = () => window.location.href = window.dashboard_url;
    let colorsIndex = 0;
    return (
        <>
            <div onScroll={(e) => {e.stopPropagation();}} onClick={handleClose} className={props.open ? [classes.backDrop, classes.visible].join(' ') : classes.backDrop} />
            <div className={props.open ? classes.wrapper : [classes.close, classes.wrapper].join(' ')}>
                <img src={logo} className={classes.logo} alt="" />
                <img src={close} className={classes.closeButton} onClick={props.onClose} alt="" />

                <ul className={classes.navMenu}>
                    <li><NavLink exact to={'/'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['Home']}</NavLink></li>
                    <li><NavLink exact to={'/About'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['About']}</NavLink></li>
                    <li><NavLink exact to={'/Categories'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['Online Classes']}</NavLink></li>
                    <li><NavLink exact to={'/Workshops'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['Workshops']}</NavLink></li>
                    <li><NavLink exact to={'/groupClasses'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['Group Classes']}</NavLink></li>
                    <li><NavLink exact to={'/blog'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['Blog']}</NavLink></li>
                    <li><NavLink exact to={'/ContactUs'} className={classes.navLink} activeClassName={classes.active} style={{'--indexColor': getColorOfIndex(colorsIndex++)}}>{strings['Contact Us']}</NavLink></li>
                    {
                        signedIn ? (
                            <>
                                <li onClick={handleGotoDashboard}><Link className={classes.small} to={'/signIn'}>{strings['Dashboard']}</Link></li>
                                <li onClick={handleDialogOpen}><Link className={classes.small}>{strings['Logout']}</Link></li>
                                {/*asdasdasdd*/}
                            </>
                        ) : (
                            <>
                                <li><Link className={classes.small} to={'/signIn'}>{strings['Login']}</Link></li>
                                <li><Link className={classes.small} to={'/signUp'}>{strings['Sign Up']}</Link></li>
                            </>
                        )
                    }
                </ul>
                {
                    signedIn ? (
                        <>
                            <MUIButton onClick={handleDialogOpen} style={buttonStyle} className={classes.lg}>{strings['Logout']}</MUIButton>
                            <MUIButton onClick={handleGotoDashboard} style={buttonStyle} className={classes.lg}>{strings['Dashboard']}</MUIButton>
                            {/*<Button onClick={handleDialogOpen} className={classes.lg} style={buttonStyle}>Logout</Button>*/}
                            {/*<Button onClick={handleGotoDashboard} className={classes.lg} style={buttonStyle}>Dashboard</Button>*/}
                        </>
                    ) : (
                        <>
                            <MUIButton onClick={() => props.history.push('/signIn')} style={buttonStyle} className={classes.lg}>Login</MUIButton>
                            <MUIButton onClick={() => props.history.push('/signUp')} style={buttonStyle} className={classes.lg}>Sign Up</MUIButton>
                            {/*<Button onClick={() => props.history.push('/signIn')} className={classes.lg} style={buttonStyle}>Login</Button>*/}
                            {/*<Button onClick={() => props.history.push('/signUp')} className={classes.lg} style={buttonStyle}>Sign Up</Button>*/}
                        </>
                    )
                }
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <div style={{direction: 'rtl', textAlign: 'left'}}>
                            {"Logout"}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <p dir="ltr">
                                Do you want to logout from your Account?
                            </p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button style={{padding: '0 10px'}} onClick={handleLogOut} color="primary">
                            Yes
                        </Button>
                        <Button style={{padding: '0 10px'}} onClick={handleDialogClose} color="primary" autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default withRouter(NavMenu);

NavMenu.propTypes = {
    onClose: PropTypes.func
};
