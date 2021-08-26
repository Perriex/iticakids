import React, { useState , forwardRef} from 'react';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  TablePagination
} from '@material-ui/core';
import Lang from "../../../../Language";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{display:"inline-block"}}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  button: {
    margin: theme.spacing(1),
  },
}));


const WorkshopTable = props => {
  const { className, workshops , postEditClick , workshopDeleteClick , paginate , setPage , postPackagesListClick, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [page, setPage] = useState(0);


  const handlePageChange = (event, page) => {
    if(setPage){
      setPage(page + 1);
    }
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const postPackages = (post) => {
    if(postPackagesListClick){
      postPackagesListClick(post);
    }
  }

  const postDelete = (post)=>{
    if(workshopDeleteClick){
        workshopDeleteClick(post);
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell >{Lang.workshop.list.title}</TableCell>
                  <TableCell>{Lang.workshop.list.staff_name}</TableCell>
                  <TableCell>{Lang.workshop.list.capacity}</TableCell>
                  <TableCell>is group class?</TableCell>
                  <TableCell>{Lang.workshop.list.start_at}</TableCell>
                  <TableCell>{Lang.workshop.list.created_at}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workshops.slice(0, parseInt(paginate.per_page)).map((workshop , i) => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={i}
                    selected={selectedUsers.indexOf(workshop.id) !== -1}
                  >
                    <TableCell fullwidth="true" >
                      <Typography
                        onClick={()=>postEditClick(workshop)}
                        >
                          {workshop.title}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {workshop.staff.user.name + " " + workshop.staff.user.family}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {workshop.capacity}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {workshop.is_group_class==='1'?`yes`:`no`}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {workshop.start_at}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {moment(workshop.created_at).format("Y-MM-DD HH:mm")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="contained"
                          component={CustomRouterLink}
                          to={window.dashboard_url + "/workshops/" + workshop.slug + "/reserves"}
                          >
                          {Lang.workshop.list.reserves}
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          className={classes.button}
                          component={CustomRouterLink}
                          to={window.dashboard_url + "/workshops/" + workshop.slug}
                          >
                          {Lang.common.edit}
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={<DeleteIcon />}
                          onClick={()=>postDelete(workshop)}
                        >
                          {Lang.common.delete}
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={paginate.total}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={paginate.current_page - 1}
          rowsPerPage={parseInt(paginate.per_page)}
          rowsPerPageOptions={[parseInt(paginate.per_page)]}
        />
      </CardActions>
    </Card>
  );
};

WorkshopTable.propTypes = {
  className: PropTypes.string,
  workshops: PropTypes.array.isRequired
};

export default WorkshopTable;
