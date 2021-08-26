import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './BlindPagination.module.scss';

const BlindPagination = props => {
    const dots = [];
    for (let i = 0; i < props.pageCount; i++)
        dots.push(0);
    dots[props.activePage] = 1;
    return (
        <div className={classes.wrapper} style={{...props.style, direction: props.rtl ? 'rtl' : 'ltr'}}>
            {
                dots.map((dot, idx) => (
                    <div
                        key={idx}
                        className={dot === 1 ? [classes.dot, classes.active].join(' ') : classes.dot}
                        onClick={() => props.onPageChange(idx)}
                    />
                ))
            }
        </div>
    )
};

export default BlindPagination;

BlindPagination.propTypes = {
    rtl: PropTypes.bool,
    activePage: PropTypes.number,
    pageCount: PropTypes.number,
    onPageChange: PropTypes.func,
};
