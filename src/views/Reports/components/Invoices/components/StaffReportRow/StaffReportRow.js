import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    Paper,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@material-ui/core';
import axios from "axios";
import Lang from "../../../../../../Language"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


export default function BasicTable( props ) {
    const { row } = props;
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
            {Lang.reports.invoices.form.staff}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.irt_income}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.irt_site_income}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.usd_income}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.usd_site_income}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.hours}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.pending_hours}
            </TableCell>
            <TableCell>
            {Lang.reports.invoices.form.students}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                    <ListItem >
                        <ListItemAvatar>
                        <Avatar alt={row.staff.name + " " + row.staff.family} src={row.staff.avatar ? axios.defaults.baseURL + row.staff.avatar : null} />
                        </ListItemAvatar>
                        <ListItemText primary= {row.staff.name + " " + row.staff.family} />
                    </ListItem>
                </TableCell>
                <TableCell align="right">{row.irt_income}</TableCell>
                <TableCell align="right">{row.irt_site_income}</TableCell>
                <TableCell align="right">{row.usd_site_income}</TableCell>
                <TableCell align="right">{row.usd_income}</TableCell>
                <TableCell align="right">{row.hours}</TableCell>
                <TableCell align="right">{row.pending_hours}</TableCell>
                <TableCell align="right">{row.students}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
