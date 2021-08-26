import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './MasterInfo.module.scss';
import TinyArticle from "../../components/TinyArticle/TinyArticle";
import TitledImage from "../../components/TitledImage/TitledImage";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import { isMobile } from "react-device-detect";
import { Paper } from '@material-ui/core';
import { strings } from "../../constants/js/strings";



const MasterInfo = props => {
    const [readMore, setReadMore] = React.useState(false);
    const handleReadMore = () => {
        setReadMore(true);
    };
    // const arr = props.body ? [props.body.split('\n').join('\<br />'), ''] : '';
    const arr = props.body ? props.body : '';
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.imageContainer}>
                    <img src={props.photo} />
                    <p>{props.name}</p>
                </div>
                <div className={classes.bio}>
                    <p dangerouslySetInnerHTML={{ __html: arr }} />
                </div>
            </div>
            <div className={classes.chart}>
                <div>
                    <p>Program Taught</p>
                    <p>Age Group</p>
                    <p>Teach Since</p>
                    <p>Languages Spoken</p>
                </div>
                <div>
                    <p>{props.json.programTaught||""}</p>
                    <p>{props.json.ageGroup||""}</p>
                    <p>{props.json.TeachSince||""}</p>
                    <p>{props.json.LanguagesSpoken||""}</p>
                </div>
            </div>
        </>
    )
};

export default MasterInfo;

MasterInfo.propTypes = {
    photo: PropTypes.string,
    body: PropTypes.string
};
