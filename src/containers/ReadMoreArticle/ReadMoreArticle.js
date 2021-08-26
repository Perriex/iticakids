import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './ReadMoreArticle.module.scss';
import TinyArticle from "../../components/TinyArticle/TinyArticle";
import TitledImage from "../../components/TitledImage/TitledImage";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import {isMobile} from "react-device-detect";
import {Paper} from '@material-ui/core';
import {strings} from "../../constants/js/strings";



const ReadMoreArticle = props => {
    const [readMore, setReadMore] = React.useState(false);
    const handleReadMore = () => {
        setReadMore(true);
    };
    // const arr = props.body ? [props.body.split('\n').join('\<br />'), ''] : '';
    const arr = props.body ? props.body : '';
    return (
        <div className={classes.wrapper} style={{height: readMore ? 'auto' : isMobile ? 330 : 220}}>
            <span className={classes.imageWrapper}>
                <TitledImage noBorder src={props.photo}/>
            </span>
            <Loading isLoading={props.body === undefined} height={200} />
            <div className={classes.textWrapper} dangerouslySetInnerHTML={{ __html: arr}} />
            {
                (!readMore && props.body !== undefined) && (
                    <div className={classes.shadow}>
                        <Button onClick={handleReadMore} style={{width: 130, position: 'relative'}}>
                            {strings['Read more...']}
                        </Button>
                    </div>
                )
            }

        </div>
    )
};

export default ReadMoreArticle;

ReadMoreArticle.propTypes = {
    photo: PropTypes.string,
    body: PropTypes.string
};
