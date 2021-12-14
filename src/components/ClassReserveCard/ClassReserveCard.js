import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './ClassReserveCard.module.scss';
import Button from "../Button/Button";
import hourglass from '../../assets/clock/hourglass.gif';
import price from '../../assets/clock/price.gif';
import {strings} from "../../constants/js/strings";
const ClassReserveCard = props => (
    <div className={classes.wrapper} onClick={props.onButtonClick}>
        <div className={classes.photo} style={{backgroundImage: `url(${props.photo})`}} />
        <div className={classes.title}>{props.title}</div>
        <div className={classes.time}>{strings['Duration']}:&nbsp;{props.time}</div>
        <div className={classes.price}>{strings['Price']}:&nbsp;{props.price}</div>
        <Button style={{borderRadius: 10, marginTop: 7}}>{props.buttonText}</Button>
    </div>
);

export default ClassReserveCard;

ClassReserveCard.propTypes = {
    photo: PropTypes.string,
    buttonText: PropTypes.string,
    name: PropTypes.string,
    onButtonClick: PropTypes.func,
};
ClassReserveCard.defaultProps = {
    onButtonClick: () => {}
};
