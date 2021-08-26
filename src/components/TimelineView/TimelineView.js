import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './TimelineView.module.scss';
import {getColorOfIndex} from "../../constants/js/functions";

const TimelineView = props => {
    return (
        <div className={classes.wrapper}>
            {
                props.tabs.map((tab, idx) => (
                    <div className={classes.tabWrapper} key={idx}>
                        <div
                            className={tab === props.activeTab ? [classes.tab, classes.active].join(' ') : classes.tab}
                            onClick={() => (tab !== props.activeTab) && props.onTabChange(tab)}
                            style={{'--indexColor': getColorOfIndex(idx)}}
                        >
                            {idx + 1}
                        </div>
                        {tab}
                    </div>
                ))
            }
            <div className={classes.line} />
        </div>
    )
};

export default TimelineView;

TimelineView.propTypes = {
    activeTab: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.string),
    onTabChange: PropTypes.func,
};
