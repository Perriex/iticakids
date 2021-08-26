import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './MasterReserveCard.module.scss';
import Button from "../Button/Button";
import {withRouter} from 'react-router-dom';

const MasterReserveCard = props => (
    <div className={classes.wrapper}>
        <div className={classes.photo} style={{backgroundImage: `url(${props.photo})`}}>
            <div className={classes.shadow}>{props.name}</div>
        </div>
        <Button style={{borderRadius: '0 0 15px 15px', marginTop: 4}} onClick={() => props.history.push(props.linkTo)}>{props.buttonText}</Button>
    </div>
);

export default withRouter(MasterReserveCard);

MasterReserveCard.propTypes = {
    photo: PropTypes.string,
    title: PropTypes.string,
    time: PropTypes.string,
    price: PropTypes.string,
    buttonText: PropTypes.string,
    linkTo: PropTypes.string,
};
