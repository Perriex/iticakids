import React , { useState } from "react";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import {
    Typography,
    TextField,
    IconButton,
    Button,
} from '@material-ui/core';
import AttachIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import store from "store";
import axios from "axios";
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
    root: {
        padding : theme.spacing(1),
        background : "#fff9",
    },
    flexRow : {
        display : "flex",
        flexDirection : "row",
        alignItems : "flex-end",
    },
    marginLeft : {
        marginLeft : theme.spacing(1)
    }
}))

const SendBox = (props) => {
    const classes = useStyles();

    const {receiver_id , appendMessage} = props;

    const [message , setMessage] = useState("");
    const [sender_id] = useState(store.get("user").id)
    const [file, setFile] = React.useState(null);

    const sendMessage = (text) => {
        if(!message.length){
            return;
        }

        let data = new FormData();
        data.append("sender_id" , sender_id);
        data.append("receiver_id" , receiver_id);
        data.append("body" , message);
        if(file){
            data.append("attach" , file);
        }

        axios.post('api/chats/send', data, {
            headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data'  // important in sending images
            }
        }).then(res => {
            if(appendMessage){
                appendMessage(res.data.data)
            }
            setMessage("");
            setFile(null);
        })
        .catch(err => {
            // setLoadingState(false);
        });
    };
    

    
    const imageSelectedHandler = e => {
        if(!e.target.files.length){
            setFile(null);
            return;  
        } 
        let avatar = e.target.files[0];
        setFile(avatar);

        // TODO this part can be deleted until end of this function. -------------------
        // because the avatar should be loaded from props, not state!
        var reader = new FileReader();
        reader.onload = (e) => {
            // setFile(e.target.result);
        };
        // setImageName(e.target.files[0].name);
        reader.readAsDataURL(e.target.files[0]);
    };


    return (
        <div className={clsx(classes.flexRow , classes.root)}>
             <TextField
                id="outlined-multiline-flexible"
                label={Lang.messages.message_hint}
                multiline
                rowsMax={4}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                />
                <input onChange={imageSelectedHandler} style={{display: 'none'}} accept="image/*,application/pdf,application/msword" className={classes.input} id="contained-button-file" multiple type="file" />
                <label htmlFor="contained-button-file">
                    <IconButton color={file ? "primary" : ""} className={classes.marginLeft} aria-label="upload file" component="span">
                        <AttachIcon />
                    </IconButton>
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.marginLeft}
                    endIcon={<SendIcon/>}
                    onClick={sendMessage}
                >
                    {Lang.messages.send}
                </Button>
        </div>
    )
}


export default SendBox;