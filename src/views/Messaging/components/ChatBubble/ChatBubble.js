import React from "react";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import {
    Divider,
    Link,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import Lang from "../../../../Language"
import moment from "moment";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {
        padding : theme.spacing(1),
        background : "#fff9",
    },
    bubble : {
        maxWidth : "450px",
        background : "#fff",
        borderRadius : 8,
        margin : `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        boxShadow : "0 0 5px #3333",
    },
    body : {
        padding : theme.spacing(2),
        textAlign : Lang.direction == "ltr" ? "left" : "right" ,
        direction : Lang.direction,
    },
    subInfo : {
        padding : theme.spacing(1),
        display : "flex",
        alignItems : "center"
    },
    fullWidth : {
        width : "100%",
        display : "inline-block"
    },
    shiftRight : {
        position : "relative",
        right : "-16px",
        zIndex : "1"
    },
    marginLeft : {
        marginLeft : theme.spacing(1)
    },
    flex : {
        display : "flex",
        width : "100%"
    },
    leftSide : {
        justifyContent : "flex-start",
    },
    rightSide : {
        justifyContent : "flex-end",
    }
}))

const ChatBubble = (props) => {
    const classes = useStyles();
    const {message , user_id} = props;
    return (
        <div data-chat-bubble className={clsx(classes.flex , user_id == message.sender_id ? classes.leftSide : classes.rightSide)}>
            <div className={classes.bubble}>
                <div  className={classes.body}>
                        {message.body}
                </div>
                <Divider />
                <div className={classes.subInfo}>
                        <small className={clsx(classes.fullWidth , classes.marginLeft)}>{moment(message.created_at).format("YYYY-MM-DD HH:mm")}</small>
                        {message.attach ? (
                            <Link href={axios.defaults.baseURL + message.attach} target="_blank" className={classes.shiftRight}  color="primary">
                                <DownloadIcon />
                            </Link>
                        ) : null}
                        <div className={clsx(classes.subInfo , classes.marginLeft)}>
                            <CheckIcon color={message.seen == 1 ? "primary" : "disabled"} className={classes.shiftRight} fontSize="small"/>
                            <CheckIcon color="primary" fontSize="small"/>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBubble;