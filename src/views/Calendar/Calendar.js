import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { TimeTable } from "./components";

const useStyles = makeStyles((theme) => ({
    root: {
        padding : theme.spacing(3)
    },
}));

export default function Calendar(props) {
    const classes = useStyles();
    const { ...rest } = props;


    return (
        <div className={classes.root}>
            <Paper>
                <TimeTable 
                {...rest}
                dataUrl={"api/user/calendar"}
                />
            </Paper>
        </div>
    );
}
