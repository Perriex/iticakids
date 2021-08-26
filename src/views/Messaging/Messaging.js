import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { GroupsTable } from "./components";
import Loading from "../Loading";

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3)
    },
    content: {
      marginTop: theme.spacing(2)
    },
    pagination: {
      marginTop: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }));
  

const Messaging = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GroupsTable />
        </div>
    )
}

export default Messaging;