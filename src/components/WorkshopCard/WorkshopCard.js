import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './WorkshopCard.module.scss';
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import { strings } from "../../constants/js/strings";
import { getColorOfIndex } from "../../constants/js/functions";

const WorkshopCard = props => {
    return (
        <div
            onClick={props.onClick}
            className={classes.WorkshopCard}
            style={{ ...props.style }}>
            <div className={classes.img} style={{ backgroundImage: `url(${props.img})` }} />
            {/* <div className={classes.by}>{props.by}</div> */}
            <div className={classes.priceAndSessions}>
                <div className={classes.rowItem} style={{ '--indexColor': getColorOfIndex(1) }}>{strings['Sessions Count']}<br /><b>{props.sessions}</b></div>
            </div>
            <div className={classes.priceAndSessions}>
                <div className={classes.rowItem} style={{ '--indexColor': getColorOfIndex(0) }}>{strings['Language']}<br /><b>{props.lang}</b></div>
                <div className={classes.rowItem} style={{ '--indexColor': getColorOfIndex(3) }}>{strings['Age']}<br /><b>{props.age}</b></div>
                <div className={classes.rowItem} style={{ '--indexColor': getColorOfIndex(2) }}>{strings['Price']}<br /><b>${props.price}</b></div>
            </div>
            <div className={classes.title}>{props.title}</div>
            <p dangerouslySetInnerHTML={{__html:props.desc}}/>
            <Button onClick={props.onClick}>
                {/* {strings['Enroll']} */}
                by {props.by}
            </Button>
            {!props.img && <Loading color={'black'} isLoading={true} height={'calc(100% - 10px)'} />}
        </div>
    )
};

export default WorkshopCard;

WorkshopCard.propTypes = {
    img: PropTypes.string,
    title: PropTypes.string,
    by: PropTypes.string,
    sessions: PropTypes.number,
    price: PropTypes.number,
    buttonText: PropTypes.string,
    slug: PropTypes.string,
    onClick: PropTypes.func,
    responsive: PropTypes.bool,
};
WorkshopCard.defaultProps = {
    onClick: () => { }
};
