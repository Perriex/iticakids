import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Header.module.scss';
import logo from '../../assets/general/kids-logo.png';
import NavMenu from "../../components/NavMenu/NavMenu";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import ham from "../../assets/general/ham.svg";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import topWhite from "../../assets/effects/white-top-effect.svg";

const Header = props => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className={classes.wrapper}>
            <img src={ham} className={classes.ham} onClick={() => {setOpen(true)}} />
            <img src={logo} className={classes.logo} alt="" />
            <EmptySpace height={20} />
            <NavMenu open={open} onClose={() => setOpen(false)} />
            <EmptySpace height={40}/>
        </div>
    )
};

export default Header;

Header.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string
        })
    ),
};
