import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './EmptyTitledImage.module.scss';

const EmptyTitledImage = props => (
    <div
        onClick={e => props.onClick && props.onClick(e)}
        className={props.responsive ? [classes.TitledImage, classes.responsive].join(' ') : classes.TitledImage}>
    </div>
);

export default EmptyTitledImage;

EmptyTitledImage.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    noBorder: PropTypes.bool,
    onClick: PropTypes.func,
    responsive: PropTypes.bool,
};
