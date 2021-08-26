import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './ImageCard.module.scss';

const ImageCard = props => {
    return (
        <div className={classes.ImageCard} style={{backgroundImage: `url(${props.src})`}} />
    )
};

export default ImageCard;

ImageCard.propTypes = {
    src: PropTypes.string
};
