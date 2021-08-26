import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './BlackWrapper.module.scss';
import topEffect from '../../assets/effects/top.svg';
import bottomEffect from '../../assets/effects/bottom.svg';

const BlackWrapper = props => (
    <div className={classes.wrapper}>
        <div className={classes.effectImage} style={{backgroundImage: `url(${topEffect})`}} />
        <div className={classes.blackBody}>
            {props.children}
        </div>
        {
            props.removeBottomEffect || <div className={classes.effectImage} style={{backgroundImage: `url(${bottomEffect})`}} />
        }
    </div>
);

export default BlackWrapper;

BlackWrapper.propTypes = {
    text: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    removeBottomEffect: PropTypes.bool,
};
