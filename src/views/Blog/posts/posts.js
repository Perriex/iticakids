import React , {useState , Fragment} from 'react';
import { makeStyles } from '@material-ui/styles';
import {PostsTable , PostToolbar} from "./components";
import Loading from "../../Loading";
import { Grid } from '@material-ui/core';
import axios from "axios";
import Dialog from "../../Dialog";
import { withRouter } from 'react-router-dom';
import Lang from "../../../Language";
import { Toast } from "../../../config/ToastConfig/Toast.config";


const useStyles = makeStyles(theme => ({
    root: {
        padding : theme.spacing(3)
    },
    content: {
        paddingTop: theme.spacing(3)
    }
  }));

const Posts = (props) => {

    const [showLoading , setLoadingState] = useState(true);
    const [posts , setPosts] = useState([]);
    const [pagination_info , setPaginationInfo] = useState({});
    const [categoris , setCategories] = useState([]);
    const [search , setSearch] = useState("");
    const [postToEdit , setPostToEdit] = useState({});
    const [openDialog , setDialogState] = useState(false);
    const [openDeleteDialog , setDeleteDialogState] = useState(false);
    const [filterData , setFilterData] = useState({});

    React.useEffect(() => {
        filterPosts();
        getCategories();
    }, []);


    
    const filterPosts = (search, column , category, dir, length , page) => {
        // return;
        let data = filterData;
        data = {
          search: search,
          column: column,
          cat_id: category,
          dir: dir,
          length: length
        };

        setFilterData(data);
        
        axios.get('api/admin/blog/posts/filter', {params : {...data , page : page}}).then(res => {
            setPosts(res.data.data.data);
            setPaginationInfo(res.data.data);
            setLoadingState(false);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        });
    };

    
    const getCategories = () => {
        // return;
        let data = filterData;
        
        axios.get('api/v1.0/blog/cats', {params : data}).then(res => {
            setCategories(res.data);
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        });
    };

    const onPostAdd = () => {
        setPostToEdit({id:null , name : ""});
        setDialogState(true);
    }

    
    const setPostPage = (page) => {
        filterPosts(filterData.search , filterData.column , filterData.dir, filterData.length , page);
    }

    const onPostDelete = (post) => {
        setPostToEdit(post);
        setDeleteDialogState(true);
    }

    const deletePost = () => {
        let post = postToEdit;
        setLoadingState(true);
        
        axios.delete(`api/admin/blog/posts/${post.slug}`).then(res => {
            // window.location.reload();
            // props.history.
            // props.history.replace(window.dashboard_url + '/posts')
            filterPosts();
            // setLoadingState(false);
            Toast(Lang.common.success , "success");
        }).catch(err => {
            Toast(Lang.common.connection_error , "danger");
            setLoadingState(false);
        });
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            {showLoading ? (
            <Loading />
            ) : (
            <Fragment>
                <PostToolbar onFilter={filterPosts} categoris={categoris} onAdd={onPostAdd} onChange={(title)=>{setSearch(title)}} />
                <Dialog 
                    open_dialog={openDeleteDialog}
                    msg="Do you want to delete this post"
                    title="warning!"
                    negative_btn="cancel"
                    positive_btn="delete"
                    on_negative_btn={() => setDeleteDialogState(false)}
                    on_positive_btn={deletePost}
                />
                <div className={classes.content}>
                    <Grid
                        container
                        spacing={4}
                    >
                        <Grid
                        item
                        md={12}
                        xs={12}
                        >
                        <PostsTable paginate={pagination_info} setPage={setPostPage} posts={posts} postDeleteClick={onPostDelete}/*countryPackagesListClick={countryPackagesListClick} countryEditClick={countryEditClick} countryDeleteClick={countryDeleteClick} *//>
                        </Grid>
                    </Grid>
                </div>
            </Fragment>
            )}
        </div>
    );
};

export default withRouter(Posts);
