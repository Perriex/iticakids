import React , {useState} from "react";
import { makeStyles } from '@material-ui/styles';
import {ChatBubble} from "../../components"
import Loading from "../../../Loading";
import store from "store";
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {
        padding : theme.spacing(1),
        background : "#fff9",
    },
    container : {
        height:  "100%",
        overflow: "auto",
        paddingTop : theme.spacing(1),
        paddingBottom : theme.spacing(1),
    }
}))


const MessageBox = (props) => {
    const classes = useStyles();
    const {receiver_id , newMessages} = props;
    const [showLoading , setLoadingState] = useState(false)
    const [messages , setMessages] = useState([]);
    const [ page , setPage ] = useState(0);
    const [ last_page , setLastPage ] = useState(Infinity);
    const [loadingContent , setLoadingContent] = useState(true);
    const [lastScrollOffset , setScrollOffset] = useState(0);
    
    React.useEffect(() => {
        if(receiver_id){
            setMessages([]);
            setLoadingState(false);
            getMessages();
        }
        setPage(0);
    } , [receiver_id]);

    React.useEffect(() => {
        scrollEnd();
    } , [newMessages]);

    React.useEffect(() => {
        setScrollPos();
    } , [messages])

    // React.useEffect(() => {

    //     if(messages.length > 0 && page = 1){
    //         scrollEnd();
    //     }
    // } , [messages])
   
    const onScroll = () => {
        let container = document.getElementById("chat-container");
        let offset = container.scrollTop;
        setScrollOffset(container.scrollHeight);
        if(offset == 0 && !isNaN(page) &&  page < last_page && !loadingContent){
            // setPage(page ? (page + 1) : 1);
            setLoadingContent(true);
            getMessages();
        }
    }

    const getUserId = () => {
        return store.get("user").id;
    }

    const getMessages = () => {
        let data = {
            sender_id : store.get("user").id,
            receiver_id : receiver_id,
            page : page + 1,
        };
        if(page == 0){
            setLoadingState(true)
        }
        axios.post("api/chats" , data).then(res => {
            // setMessages(res.data.data.reverse().concat(messages));
            let new_loaded_messages = res.data.data.reverse();
            new_loaded_messages = new_loaded_messages.slice(0,new_loaded_messages.length - newMessages.length);
            if(res.data.current_page == 1 || !res.data.current_page){
                setMessages(new_loaded_messages);
            }else{
                setMessages(new_loaded_messages.concat(messages));
            }
            
            setPage(res.data.current_page ? (res.data.current_page) : 0)
            setLastPage(res.data.last_page ? res.data.last_page : 0)
            setLoadingState(false)
            setLoadingContent(false);
            if(page == 0){
                scrollEnd();    
            }
        }).catch(err => {
            setLoadingState(false)
        })
    }

    const setScrollPos = () => {
        let container = document.getElementById("chat-container");
        container.scrollTop = container.scrollHeight - lastScrollOffset;
        // setTimeout(() => {
        // } , 200);
    }

    const scrollEnd = () => {
        let container = document.getElementById("chat-container");
        // setTimeout(() => {
        let chats = document.querySelectorAll('[data-chat-bubble]');
        let last = chats[chats.length - 1];
        if(last){
            last.scrollIntoView();
        }
        // } , 500);
    }
    
    
    return (
        <div id="chat-container" onScroll={onScroll} className={classes.container}>
            {showLoading ? (
                <Loading />
            ) : messages.concat(newMessages).map((k , i) => {
                return (
                    <ChatBubble key={i}  message={k} user_id={getUserId()} />
                )
            })}
        </div>
    )
}

export default MessageBox;