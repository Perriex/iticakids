import React from 'react';
import { makeStyles } from '@material-ui/styles';

import {
    Card , 
    CardContent , 
    Typography , 
} from '@material-ui/core';

import StaffList from "../../../StaffList";
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    space:{
        margin : theme.spacing(1)
    },
    grid_root: {
        padding: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(1)
    },
    p1: {
        padding: theme.spacing(1)
    },
    content: {
        paddingTop: theme.spacing(2)
    }, 
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    time_bar : {
        display:"flex",
        flexWrap: "wrap",
        justifyItems:"center",
        alignContent: "center",
        alignItems: "center",
    }
  }));

const StaffPicker = props => {
    const classes = useStyles();

    const {onStaffPick} = props;

    return (
        <Card>
            <CardContent>
                <Typography component="h5" variant="h5">
                    {Lang.coupon.list.form.select_staff}
                </Typography>
                <StaffList is_picker={true} onStaffPick={onStaffPick} />
            </CardContent>
        </Card>
    );
};


export default StaffPicker;
