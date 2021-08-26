import React , { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from '@material-ui/core';
import Lang from "../../../../../../../Language"
 
const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative"
    },
    borderRight : {
        borderRight: "1px solid #eeeeee"
    }
    // dateModal:{
    //     position: "absolute",
    // }
}));
 
const Reports = props => {
    const classes = useStyles();
    const { data } = props;

    const template = {
        hours : {
            hold : 0,
            pending : 0
        },
        income : {
            staffs : {
                usd : 0,
                irt : 0
            },
            site : {
                usd : 0,
                irt : 0
            },
        },
        users : {
            total : 0
        }
    }

    const [info , setInfo ] = useState(template);

    React.useEffect(() => {
        if(data){
            calcOverview();
        }
    } , [data]);

    const calcOverview = () => {
        let total = {...template};
        data.forEach(row => {
            let new_data = {
                hours : {
                    hold : total.hours.hold + row.hours,
                    pending : total.hours.pending + row.pending_hours,
                },
                income : {
                    staffs : {
                        usd : total.income.staffs.usd + row.usd_income,
                        irt : total.income.staffs.irt + row.irt_income,
                    },
                    site : {
                        usd : total.income.site.usd + row.usd_site_income,
                        irt : total.income.site.irt + row.irt_site_income,
                    },
                },
                users : {
                    total : total.users.total + row.students
                }
            }
            total = {...new_data};
        });
        setInfo(total);
    }

    return (
        <div className={classes.root}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} className={classes.borderRight} align="left">
                            {Lang.reports.overview.hours}
                        </TableCell>
                        <TableCell colSpan={1} className={classes.borderRight} align="left">
                            {Lang.reports.overview.income}
                        </TableCell>
                        <TableCell colSpan={1} className={classes.borderRight} align="left">
                            {Lang.reports.overview.usd}
                        </TableCell>
                        <TableCell colSpan={1} className={classes.borderRight} align="left">
                            {Lang.reports.overview.irt}
                        </TableCell>
                        <TableCell colSpan={2} align="left">
                            {Lang.reports.overview.students}
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                            <TableCell align="left">
                                {Lang.reports.overview.holded}
                            </TableCell>
                            <TableCell align="left" className={classes.borderRight}>{info.hours.hold}</TableCell>
                            <TableCell align="left">
                                {Lang.reports.overview.site}
                            </TableCell>
                            <TableCell align="left">{info.income.site.usd}</TableCell>
                            <TableCell align="left" className={classes.borderRight}>{info.income.site.irt}</TableCell>
                            <TableCell align="left">
                                {Lang.reports.overview.total}
                            </TableCell>
                            <TableCell align="left">{info.users.total}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell align="left">
                                {Lang.reports.overview.pending}
                            </TableCell>
                            <TableCell align="left" className={classes.borderRight}>{info.hours.pending}</TableCell>
                            <TableCell align="left">
                                {Lang.reports.overview.staffs}
                            </TableCell>
                            <TableCell align="left">{info.income.staffs.usd}</TableCell>
                            <TableCell align="left" className={classes.borderRight}>{info.income.staffs.irt}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
 
export default Reports;