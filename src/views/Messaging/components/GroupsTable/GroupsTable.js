import React , {useState , Fragment} from "react";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@material-ui/core';
import axios from "axios";
import Loading from "../../../Loading";
import { SendBox , MessageBox } from "../index";
import store from "store";
import {Toast} from "../../../../config/ToastConfig/Toast.config";
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3)
    },
    content: {
      marginTop: theme.spacing(2)
    },
    flexVertical: {
      display: 'flex',
      flexDirection : "column"
    },
    marginRight : {
        marginRight : theme.spacing(1)
    },
    roomHeight : {
        height : "75vh"
    },
    maxHeight : {
        height : "100%"
    },
    chatBg : {
        backgroundColor : "#eee",
        borderRadius : 8,
        boxShadow : "inset 0 0px 5px #3333",
    },
    messages : {
        padding : theme.spacing(2),
        height : "100%"
    }
}));
  
const GroupsTable = (props) => {
    const classes = useStyles();
    const [ showLoading , setLoadingState] = useState(false);
    const [rooms , setRooms ] = useState([]);
    const [current_user , setCurrentUser ] = useState({})
    const [newMessages , setNewMessages ] = useState([]);

    React.useEffect(() => {
        getRooms();
    } , []);

    const checkStaff = () => {
        let user = store.get("user");
        if(!user){
            return false;
        }
        return !!user.roles.filter(k => k == "staff");
    }

    const getRooms = () => {
        setLoadingState(true);
        let url = "";
        // if(checkStaff()){
        //     url = "api/chats/staff-groups";
        // }else{
            url = "api/chats/groups"
        // }
        axios.get(url).then(res => {
            setRooms(res.data);
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        })
    }
    const selectRoom = (user ) => {
        setCurrentUser(user);
        setNewMessages([]);
    }

    const appendMessages = (message) => {
        setNewMessages([...newMessages , message]);
    }

    return (
        <div  className={classes.root}>
            {showLoading ? (
                <Loading/>
            ) : (
                <Card className={classes.roomHeight}>
                    <CardContent  className={classes.maxHeight}>
                        <Grid container className={classes.maxHeight}>
                            <Grid xs={12} md={8} className={clsx(classes.maxHeight , classes.chatBg , classes.flexVertical)}>
                                <MessageBox receiver_id={current_user.id} newMessages={newMessages}/>
                                <SendBox receiver_id={current_user.id} appendMessage={appendMessages}/>
                            </Grid>
                            <Grid xs={12} md={4} className={classes.maxHeight}>
                                {rooms.map((k , i) => {
                                    return (
                                        <ListItem key={i} button selected={current_user.id == k.id} onClick={() => selectRoom(k)}>
                                            <ListItemText className={classes.marginRight} primary={k.name + " " + k.family} />
                                            <ListItemAvatar>
                                            <Avatar
                                                alt={k.name + " " + k.family}
                                                src={k.avatar ? (axios.defaults.baseURL + k.avatar) : null}
                                            />
                                            </ListItemAvatar>
                                        </ListItem>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}


export default GroupsTable;