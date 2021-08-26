import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './TitledImage.module.scss';
import Loading from "../Loading/Loading";

const TitledImage = props => (
    <div
        onClick={e => props.onClick && props.onClick(e)}
        className={props.responsive ? [classes.TitledImage, classes.responsive].join(' ') : classes.TitledImage}
        style={{
            ...props.style,
            transform: props.active ? 'scale(1.02)' : 'scale(1.0)',
            boxShadow: props.active ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
            backgroundImage: `url(${props.src})`,
            border: props.noBorder ? 'none' : '5px solid #FFFFFF',
            backgroundColor: props.backgroundColor ? props.backgroundColor : 'white'
        }}>

        {props.title && <div className={classes.shadow}>{props.title}</div>}
        {props.name && <div className={classes.shadow}>{props.name}</div>}


        {!props.src && <Loading color={'black'} isLoading={true} height={'calc(100% - 10px)'} />}


    </div>
);

export default TitledImage;

TitledImage.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    noBorder: PropTypes.bool,
    onClick: PropTypes.func,
    responsive: PropTypes.bool,
    backgroundColor: PropTypes.string,
};
