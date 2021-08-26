import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './TextArea.module.scss';

const TextArea = props => (
    <div className={classes.wrapper}>
        <div className={classes.title}>{props.title}</div>
        <textarea
            dir={props.rtl ? 'rtl' : 'ltr'}
            value={props.value}
            style={props.style}
            placeholder={props.placeholder}
            onChange={props.onChange}
            className={props.className ? [props.className, classes.Input].join(' ') : classes.Input}
            name={props.name}
        />
    </div>
);

export default TextArea;

TextArea.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    rtl: PropTypes.bool,
    name: PropTypes.bool,
};
