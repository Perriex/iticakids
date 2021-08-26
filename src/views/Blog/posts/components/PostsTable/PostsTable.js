import React, { useState , forwardRef} from 'react';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  TablePagination
} from '@material-ui/core';
import Lang from "../../../../../Language";

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


const PostsTable = props => {
  const { className, posts , postEditClick , postDeleteClick , paginate , setPage , postPackagesListClick, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [page, setPage] = useState(0);


  const handleSelectAll = event => {
    const { posts } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = posts.map(post => post.id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };


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
    if(postDeleteClick){
      postDeleteClick(post);
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
                  <TableCell >{Lang.blog.list.title}</TableCell>
                  <TableCell>{Lang.blog.list.author}</TableCell>
                  <TableCell>{Lang.blog.list.category}</TableCell>
                  <TableCell>{Lang.blog.list.created_at}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.slice(0, parseInt(paginate.per_page)).map((post , i) => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={i}
                    selected={selectedUsers.indexOf(post.id) !== -1}
                  >
                    <TableCell fullwidth="true" >
                      <Typography
                        onClick={()=>postEditClick(post)}
                        >
                          {post.title}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {post.author.name + " " + post.author.family}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {post.category ? post.category.title : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell fullwidth="true" >
                        <Typography
                        >
                          {post.created_at_p  }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="contained"
                          component={CustomRouterLink}
                          to={window.dashboard_url + "/blog/" + post.slug}
                          >
                          {Lang.common.edit}
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={<DeleteIcon />}
                          onClick={()=>postDelete(post)}
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

PostsTable.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array.isRequired
};

export default PostsTable;
