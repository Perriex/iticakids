import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Button.module.scss';
import Loading from "../Loading/Loading";

const Button = props => {
    const classNames = [classes.button];
    if (props.className) classNames.push(props.className);
    if (props.disabled) classNames.push(classes.disabled);
    if (props.isLoading) classNames.push(classes.isLoading);
    const style = props.style ? props.style : {};
    if (props.hoverBgColor) {
        classNames.push(classes.hoverBgColor);
        style['--hoverBgColor'] = props.hoverBgColor;
    }
    return (
        <div
            {...props}
            onClick={e => !props.disabled && props.onClick(e)}
            className={classNames.join(' ')}
            style={style}>
            {props.children}
            {
                props.isLoading && (
                    <div className={classes.loading}>
                        <Loading height={30} width={30} color={'#FFFFFF'} isLoading={true}/>
                    </div>
                )
            }
        </div>
    )
};

export default Button;

Button.propTypes = {
    text: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    onClick: () => {
    }
};
