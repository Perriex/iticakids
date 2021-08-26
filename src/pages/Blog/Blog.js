import React from 'react';
import classes from './Blog.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import {Toast} from '../../config/ToastConfig/Toast.config.js';
import Paper from '@material-ui/core/Paper';
import SearchBox from "../../components/SearchBox/SearchBox";
import Divider from '@material-ui/core/Divider';
import Button from "../../components/Button/Button";
import Pagination from '@material-ui/lab/Pagination';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import greenPattern from '../../assets/public/green-pattern.png';
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import bottomGreen from "../../assets/effects/green-bottom-effect.svg";
import {strings} from "../../constants/js/strings";
import * as PropTypes from "prop-types";

export const Post = props => {
    return (
        <Paper elevation={3} style={{direction: 'ltr',textAlign: 'left', overflow: 'hidden', padding: 5, marginBottom: 10, ...props.style}}>
            <img
                alt=""
                src={props.image}
                style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover'
                }}
            />
            <EmptySpace height={10} />
            <h4>{props.title}</h4>
            <div
                dir={'ltr'}
                style={{textAlign: 'justify'}}
                dangerouslySetInnerHTML={{
                    __html:props.body.replace(/(<([^>]+)>)/gi, "").trim().slice(0, 200) + "..."
                }}
            />
            <EmptySpace height={10} />
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button style={{width: 'max-content', padding: '0 10px'}} onClick={props.onClick}>{strings['Read more...']}</Button>
            </div>
        </Paper>
    );
};

Post.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.any,
    style: PropTypes.object,
};

Post.defaultProps = {
    body: `<html></html>`,
    style: {}
}

const Blog = props => {

    const [categoriesLoading, setCategoriesLoading] = React.useState(false);
    const [postsLoading, setPostsLoading] = React.useState(false);
    const [search, setSearch] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const [category, setCategory] = React.useState(null);
    const [searchText, setSearchText] = React.useState('');
    const [posts, setPosts] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [path, setPath] = React.useState('');
    const backendBaseURL = axios.defaults.baseURL;
    const [showNotFoundMessage, setShowNotFoundMessage] = React.useState(false);
    const searchInputHandler = val => setSearchText(val);
    const handleSearch = () => {
        if (searchText.trim() === '') return;
        setPostsLoading(true);
        setPosts([]);
        setShowNotFoundMessage(false);
        setSearch(true);
        axios.get(`api/v1.0/blog/posts/search/${searchText}`).then(res => {
            setPosts(res.data.data);
            setPath(res.data.path);
            setPage(res.data.current_page);
            setPageCount(res.data.last_page - res.data.current_page + 1);
            setPostsLoading(false);
            if (res.data.data.length === 0) setShowNotFoundMessage(true);
        }).catch(err => console.log( err));
    };
    const handlePageChange = (e, number) => {
        setPage(number);

        setPostsLoading(true);
        const postsUrl = `${path}?page=${number}`;
        axios.get(postsUrl).then(res => {
            setPosts(res.data.data);
            setPath(res.data.path);
            setPage(res.data.current_page);
            setPageCount(res.data.last_page - res.data.current_page + 1);
            setPostsLoading(false);
            console.log(res.data);
            if (res.data?.data?.length === 0) setShowNotFoundMessage(true);
        }).catch(err => {
            setPostsLoading(false);
            setShowNotFoundMessage(true);
            Toast(strings['An error occurred when receiving data!'],'error');
        });
    };
    const isCategoryPage = props.category;
    const catSlug = props.match.params.categorySlug;

    React.useEffect(() => {
        setPostsLoading(true);
        setCategoriesLoading(true);
        const categoriesUrl = isCategoryPage ? `/api/v1.0/blog/cats/${catSlug}` : '/api/v1.0/blog/cats';
        axios.get(categoriesUrl).then(res => {
            if (isCategoryPage) {
                setCategory(res.data.title);
                setCategories(res.data.childs /*  childs :/  */);
            } else {
                setCategories(res.data);
            }
            setCategoriesLoading(false);

        }).catch(err => {
            setCategoriesLoading(false);
            Toast(strings['An error occurred when receiving data!'],'error');
        });
        const postsUrl = `/api/v1.0/blog/${isCategoryPage ? 'cats/' + props.match.params.categorySlug + '/' : ''}posts`;
        axios.get(postsUrl).then(res => {
            setPosts(res.data.data);
            setPath(res.data.path);
            setPage(res.data.current_page);
            setPageCount(res.data.last_page - res.data.current_page + 1);
            setPostsLoading(false);
            console.log(res.data);
            if (res.data?.data?.length === 0) setShowNotFoundMessage(true);
        }).catch(err => {
            setPostsLoading(false);
            setShowNotFoundMessage(true);
            Toast(strings['An error occurred when receiving data!'],'error');
        });
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <EmptySpace height={30}/>
            <TransitionEffect stickTo={'bottom'} image={bottomGreen} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor: '#80BA5E', width: '100%', textAlign: 'center', backgroundImage: `url(${greenPattern})`}}>
                <EmptySpace height={100}/>
                <div className={classes.blogContainer}>
                    {
                        categories.length > 0 && (
                            <div className={classes.toolbar}>
                                <Paper className={classes.toolbarPaper} elevation={3}>
                                    <SearchBox
                                        placeholder={strings['Search in blog...']}
                                        onEnterPress={handleSearch}
                                        value={searchText}
                                        onChangeText={searchInputHandler}
                                    />
                                    <Divider style={{margin: '10px 0'}}/>
                                    <div className={classes.categories}>
                                        <b>{strings['Categories']}</b>
                                        <Loading isLoading={categoriesLoading} color={'#000000'} height={100} />
                                        <ul className={classes.categoriesList}>
                                            {
                                                categories.map((category, index) => (
                                                    <Link to={`/blog/categories/${category.slug}`}>
                                                        <li key={index}>{category.title}</li>
                                                    </Link>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </Paper>
                            </div>
                        )
                    }
                    <div className={classes.body}>
                        <Paper elevation={3} className={classes.bodyPaper}>
                            {
                                categories.length === 0 && (
                                    <>
                                        <SearchBox
                                            placeholder={strings['Search in blog...']}
                                            onEnterPress={handleSearch}
                                            value={searchText}
                                            onChangeText={searchInputHandler}
                                        />
                                        <Divider style={{margin: '10px 0'}}/>
                                    </>
                                )
                            }
                            <div style={{direction: 'ltr', textAlign: 'left'}}>
                                {
                                    (category && !search) ? <b>{`${strings['Categories']}: ` + category}</b> : ''
                                }
                            </div>
                            <Loading isLoading={postsLoading} color={'#000000'} height={200} />
                            {
                                showNotFoundMessage && (
                                    <div style={{ width: '100%', height: 200,display: 'flex', alignItems: 'center', justifyContent: 'center', direction:'ltr'}}>
                                        <h2>{strings['Couldn\'t find anything!']}</h2>
                                    </div>
                                )
                            }
                            {
                                posts?.map((post, index) => (
                                    <Post
                                        key={index}
                                        title={post.title}
                                        body={post.body}
                                        image={backendBaseURL + post.banner}
                                        onClick={() => props.history.push(`/blog/posts/${post.slug}`)}
                                    />
                                ))
                            }
                            <Paper elevation={3} style={{textAlign: 'center', transform: 'translateY(10px)',  width: 'calc(100% + 20px)', marginLeft: -10, padding: 5, height: 40, marginBottom: -50}}>
                                {
                                    postsLoading ? (<Loading isLoading={true} color={'#000000'} height={20} />) : (
                                        <Pagination
                                            style={{display: 'inline-block', margin: '0 auto'}}
                                            page={page}
                                            count={pageCount}
                                            shape="rounded"
                                            onChange={handlePageChange}
                                        />
                                    )
                                }
                            </Paper>
                        </Paper>
                    </div>
                </div>
                <EmptySpace height={140}/>
            </div>
            <Footer/>
        </div>
    )
};

export default withRouter(Blog);

Blog.propTypes = {};
