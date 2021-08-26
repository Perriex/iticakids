import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './TransitionEffect.module.scss';


const TransitionEffect = props => {
    const classNames = [classes.effect];
    if (props.className) classNames.push(props.className);
    const styles = props.styles ? props.styles : {};
    if (props.stickTo === 'top') {
        styles.marginBottom = -40;
        styles.backgroundPosition = 'top';
    } else if (props.stickTo === 'bottom') {
        styles.marginTop = -40;
        styles.backgroundPosition = 'bottom';
    }
    styles.backgroundImage = `url(${props.image})`;
    return (
        <div
            className={classNames.join(' ')}
            style={styles}
        />
    )
};

export default TransitionEffect;

TransitionEffect.propTypes = {
    image: PropTypes.string,
    stickTo: PropTypes.string,
};

TransitionEffect.defaultProps = {
    stickTo: 'top'
};
