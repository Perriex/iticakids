import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './ArticleCard.module.scss';
import Button from "../Button/Button";

const ArticleCard = props => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>{props.title}</div>
            <div className={classes.body}>{props.body}</div>
            <br />
            <Button>{props.buttonText}</Button>
        </div>
    )
};

export default ArticleCard;

ArticleCard.propTypes = {
    title: PropTypes.string,
    body: PropTypes.string,
    buttonText: PropTypes.any,
};
