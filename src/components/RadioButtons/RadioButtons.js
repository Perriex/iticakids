import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './RadioButtons.module.scss';
import {getColorOfIndex} from "../../constants/js/functions";

const RadioButtons = props => {
    const activeButtonClassNames = [classes.RadioButton, classes.active].join(' ');
    const regularButtonClassNames = classes.RadioButton;
    const getClassNames = (value) => {
        return props.value === value ? activeButtonClassNames : regularButtonClassNames
    };

    return (
        <div className={classes.RadioButtons}>
            {
                props.options.map((btn, index) => (
                    <div
                        key={btn.value}
                        className={getClassNames(btn.value)}
                        onClick={() => props.onOptionClick(btn.value)}
                    >
                        {btn.displayValue}
                    </div>
                ))
            }
        </div>
    )
};

export default RadioButtons;

RadioButtons.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any,
            displayValue: PropTypes.string
        })
    ),
    value: PropTypes.any,
    onOptionClick: PropTypes.func
};
RadioButtons.defaultProps = {
    onOptionClick: () => {},
    items: []
};
