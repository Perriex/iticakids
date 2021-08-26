import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './SearchBox.module.scss';
import SearchIcon from '@material-ui/icons/Search';

const SearchBox = props => {
    const handleKeydown = e => e.keyCode === 13 && props.onEnterPress();

    return (
        <div className={classes.SearchBox} style={props.style}>
            <input
                {...props}
                onKeyDown={handleKeydown}
                className={classes.input}
                type="search"
                onChange={e => props.onChangeText(e.target.value)}
                placeholder={props.placeholder}
                value={props.value}
            />
            <SearchIcon style={{color: '#AAAAAA'}} />
        </div>
    );
};

export default SearchBox;

SearchBox.propTypes = {
    value: PropTypes.string,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    onEnterPress: PropTypes.func,
};
