import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './TinyArticle.module.scss';

const TinyArticle = props => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>{props.title}</div>
            <div className={classes.body}>{props.body}</div>
        </div>
    )
};

export default TinyArticle;

TinyArticle.propTypes = {
    title: PropTypes.string,
    body: PropTypes.string
};
