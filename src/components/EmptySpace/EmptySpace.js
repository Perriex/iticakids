import React from 'react';
import * as PropTypes from 'prop-types';

const EmptySpace = props => <div style={{height: props.height, width: props.width ? props.width : 'auto'}} />;

export default EmptySpace;

EmptySpace.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
};
