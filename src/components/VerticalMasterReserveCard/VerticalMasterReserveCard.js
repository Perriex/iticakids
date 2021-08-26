import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './VerticalMasterReserveCard.module.scss';
import Button from "../Button/Button";
import {withRouter} from 'react-router-dom';
import {Paper} from '@material-ui/core';
const VerticalMasterReserveCard = props => {

    const gotToLink = () => {
        props.history.push(props.linkTo);
    };

    return (
        <Paper elevation={3} className={classes.wrapper} >
            <div className={classes.photo} style={{backgroundImage: `url(${props.photo})`}} onClick={gotToLink}>
                <div className={classes.shadow}>{props.name}</div>
            </div>
            <div className={classes.bodyWrapper}>
                <div
                    className={classes.description}
                    dangerouslySetInnerHTML={{__html:props.bio.replace(/(<([^>]+)>)/gi, "").trim().slice(0, window.innerWidth <= 600 ? 200 : 500) + "..."}}
                />
                <div className={classes.lastRow}>
                    <div className={classes.count}>
                        {props.lastRowText}
                    </div>
                    <Button
                        className={classes.btn}
                        style={{marginTop: 4}}
                        onClick={gotToLink}
                    >
                        {props.buttonText}
                    </Button>
                </div>
            </div>
        </Paper>
    )
};

export default withRouter(VerticalMasterReserveCard);

VerticalMasterReserveCard.propTypes = {
    photo: PropTypes.string,
    title: PropTypes.string,
    time: PropTypes.string,
    price: PropTypes.string,
    buttonText: PropTypes.string,
    linkTo: PropTypes.string,
    bio: PropTypes.string,
    lastRowText: PropTypes.string,
};
VerticalMasterReserveCard.defaultProps = {
    days: [],
    bio: ''
};
