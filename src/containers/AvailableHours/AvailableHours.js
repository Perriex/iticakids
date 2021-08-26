import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './AvailableHours.module.scss';
import {strings} from "../../constants/js/strings";

const AvailableHours = props => {

    const empties = [];
    for (let i = 0; i < props.perRow; i++) empties.push(i);
    // console.log(props.items)
    return (
        <div className={classes.wrapper} style={{width: props.perRow * 60 + 5}}>
            {
                props.items && props.active && (
                    props.items[props.active] && props.items[props.active].map(item => (
                        <div
                            key={Math.random()}
                            className={props.selectedHour === item ? [classes.hour, classes.active].join(' ') : classes.hour}
                            onClick={() => props.onItemSelect(item)}
                        >
                            {item}
                        </div>
                    ))
                )
            }
            {
                props.items && props.active && props.items[props.active] && props.perRow < props.items[props.active].length && empties && empties.map(() => (
                    <div key={Math.random()} className={classes.empty} />
                ))
            }
            {
                (!props.active) && (
                    <div className={classes.nothingSelected}>{strings['Choose The Day!']}</div>
                )
            }
        </div>
    )
};

export default AvailableHours;

AvailableHours.propTypes = {
    items: PropTypes.object,
    active: PropTypes.string,
    perRow: PropTypes.number,
    onItemSelect: PropTypes.func,
    selectedHour: PropTypes.string,
};
