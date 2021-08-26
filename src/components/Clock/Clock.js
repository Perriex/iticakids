import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Clock.module.scss';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const Clock = props => {
    const [val, setVal] = React.useState(10);

    React.useEffect(() => {
        setVal(props.value);
    }, []);

    return (
        <div className={classes.Clock} onClick={props.onSelect}>
            <svg className={classes.svg} viewBox="0 0 32 32">
                <circle className={classes.circle} r="16" cx="16" cy="16" style={{strokeDasharray: `${val / 0.6 + 1} 100`}}/>
            </svg>
            <div className={classes.display}>
                {props.value}&nbsp;
                دقیقه
            </div>

            <div className={classes.radio}>
                <GreenRadio
                    checked={props.active}
                    onChange={props.onSelect}
                    name="radio-button"
                />
            </div>
        </div>
    )
};

export default Clock;

Clock.propTypes = {
    text: PropTypes.string,
    style: PropTypes.object,
    onSelect: PropTypes.func
};
