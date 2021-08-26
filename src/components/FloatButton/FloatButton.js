import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './FloatButton.module.scss';

const FloatButton = props => (
    <div
        onClick={e => props.onClick && props.onClick(e)}
        className={props.className ? [classes.button, props.className].join(' ') : classes.button}
        style={props.style}>
        {props.children}
    </div>
);

export default FloatButton;

FloatButton.propTypes = {
    text: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
};
