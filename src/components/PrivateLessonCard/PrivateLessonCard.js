import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './WorkshopCard.module.scss';
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import { strings } from "../../constants/js/strings";
import { getColorOfIndex } from "../../constants/js/functions";

const PrivateLessonCard = props => {
    return (
        <div
            className={classes.WorkshopCard}
            onClick={e => props.onClick && props.onClick(e)}
            style={{ ...props.style }}>
            <div className={classes.img} style={{ backgroundImage: `url(${props.img})` }} />
            <div className={classes.priceAndSessions}>
            <div className={classes.rowItem} style={{ '--indexColor': '#7d32a8' }}>{strings['Language']}<br /><b>{props.language}</b></div>
            <div className={classes.rowItem} style={{ '--indexColor': getColorOfIndex(0) }}>{strings['Age']}<br /><b>{props.age}</b></div>
                <div className={classes.rowItem} style={{ '--indexColor': getColorOfIndex(1) }}>{strings['Price']}<br /><b>{props.price}</b></div>
            </div>
            <div className={classes.title}>{props.title}</div>
            {/* <div className={classes.by}>{props.by}</div> */}
            <Button className={classes.button}>by {props.by}</Button>
            {!props.img && <Loading color={'black'} isLoading={true} height={'calc(100% - 10px)'} />}
        </div>
    )
};

export default PrivateLessonCard;

PrivateLessonCard.propTypes = {
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
PrivateLessonCard.defaultProps = {
    onClick: () => { }
};
