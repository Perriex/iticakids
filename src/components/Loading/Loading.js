import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Loading.module.scss';
import ReactLoading from 'react-loading';

const Loading = props => {
    const {color = '#FFFFFF', isLoading, height, width} = props;
    return isLoading && (
        <div className={classes.loadingContainer} style={{height: height ? height : 'auto', width: width ? width : 'auto'}}>
            <ReactLoading type={'spin'} color={color} height={'20px'} width={'30px'} />
        </div>
    )
};
export default Loading;

Loading.propTypes = {
    isLoading: PropTypes.bool,
    color: PropTypes.string,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};
