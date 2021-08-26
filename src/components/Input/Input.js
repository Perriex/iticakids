import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Input.module.scss';

const Input = props => (
    <div className={classes.wrapper}>
        <div style={props.rtl ? {textAlign: 'right', direction: 'rtl'} : {textAlign: 'left', direction: 'ltr'}}>{props.title}</div>
        <input
            name={props.name}
            dir={props.rtl ? 'rtl' : 'ltr'}
            value={props.value}
            type={props.type}
            style={props.style}
            placeholder={props.placeholder}
            onChange={props.onChange}
            className={props.className ? [props.className, classes.Input].join(' ') : classes.Input}
        />
    </div>
);

export default Input;

Input.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    rtl: PropTypes.bool,
    name: PropTypes.string,
};
