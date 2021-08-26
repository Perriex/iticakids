import React , {useState}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { withRouter } from "react-router-dom";
import { MessageBox , SendBox } from "../../../../../Messaging/components"

const useStyles = makeStyles((theme) => ({
  root: {
    height : "70vh",
    display : "flex",
    flexDirection : "column"
  },
}));

function Chat(props) {
    const classes = useStyles();
    const [newMessages , setNewMessages ] = useState([]);
    const [ user_id ] = useState(props.match.params.user_id);
    const appendMessages = (message) => {
        setNewMessages([...newMessages , message]);
    }
    return (
        <div className={classes.root}>
            <MessageBox receiver_id={user_id} newMessages={newMessages}/>
            <SendBox receiver_id={user_id} appendMessage={appendMessages}/>
        </div>
    );
}


export default withRouter(Chat)