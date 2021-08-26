import React from 'react';
import classes from './BlogPostPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import {Toast} from '../../config/ToastConfig/Toast.config.js';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {withRouter} from 'react-router';
import {strings} from "../../constants/js/strings";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import bottomGreen from "../../assets/effects/green-bottom-effect.svg";
import greenPattern from "../../assets/public/green-pattern.png";
import facebook from '../../assets/share/facebook.svg';
import googleplus from '../../assets/share/googleplus.svg';
import linkedin from '../../assets/share/linkedin.svg';
import pinterest from '../../assets/share/pinterest.svg';
import twitter from '../../assets/share/twitter.svg';
const Post = props => {
    return (
        <Paper elevation={3}
               style={{direction: 'rtl', textAlign: 'right', overflow: 'hidden', padding: 5, marginBottom: 10}}>
            <div style={{textAlign: 'center'}}>
                <img
                    alt=""
                    src={props.image}
                    style={{
                        width: 500,
                        maxWidth: '100%',
                        height: 300,
                        objectFit: 'cover',
                        margin: '20px auto 0 auto'
                    }}
                />
            </div>
            <EmptySpace height={10}/>
            <h4>{props.title}</h4>
            <div
                style={{textAlign: 'justify'}}
                dangerouslySetInnerHTML={{__html: props.body}}
            />
            <EmptySpace height={10}/>
            <div className={classes.shareLinks}>
                <a href={`http://www.facebook.com/sharer.php?u=${window.location.href}`} className={classes.shareLink}>
                    <img src={facebook} alt="facebook" />
                </a>
                <a href={`https://plus.google.com/share?url=${window.location.href}`} className={classes.shareLink}>
                    <img src={googleplus} alt="googleplus" />
                </a>
                <a href={`http://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} className={classes.shareLink}>
                    <img src={linkedin} alt="linkedin" />
                </a>
                <a href={`https://pinterest.com/pin/create/link/?url=${window.location.href}`} className={classes.shareLink}>
                    <img src={pinterest} alt="pinterest" />
                </a>
                <a href={`https://twitter.com/share?url=${window.location.href}`} className={classes.shareLink}>
                    <img src={twitter} alt="twitter" />
                </a>
            </div>
            <Divider style={{margin: '10px 0'}}/>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span><img src={props.authorAvatar} style={{
                    width: 30,
                    height: 30,
                    objectFit: 'cover',
                    margin: '0px 10px',
                    borderRadius: '50%'
                }}/>{props.authorName}</span>
                <span dir={'ltr'} style={{color: '#444444'}}><CalendarTodayIcon/> {props.date}</span>
            </div>
        </Paper>
    );
};

const BlogPostPage = props => {

    const [postsLoading, setPostsLoading] = React.useState(false);
    const [post, setPost] = React.useState(null);
    const backendBaseURL = axios.defaults.baseURL;

    React.useEffect(() => {
        console.log("AAAA");
        setPostsLoading(true);
        axios.get(`/api/v1.0/blog/posts/${props.match.params.postSlug}`).then(res => {
            console.log(res.data);
            setPost({
                title: res.data.title,
                body: res.data.body,
                banner: res.data.banner,
                date: res.data.created_at_p,
                author: res.data.author
            });
            setPostsLoading(false);
        }).catch(err => {
            setPostsLoading(false);
            Toast(strings['An error occurred when receiving data!'], 'error');
        });
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <EmptySpace height={30}/>
            <TransitionEffect stickTo={'bottom'} image={bottomGreen}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#80BA5E',
                width: '100%',
                textAlign: 'center',
                backgroundImage: `url(${greenPattern})`
            }}>
                <EmptySpace height={40}/>
                <div className={classes.blogContainer}>
                    <div className={classes.body}>
                        <Loading isLoading={postsLoading} color={'white'} height={500}/>

                        {
                            post && (
                                <Post
                                    title={post.title}
                                    body={post.body}
                                    image={backendBaseURL + post.banner}
                                    date={post.date}
                                    authorName={post.author.name + post.author.family}
                                    authorAvatar={backendBaseURL + post.author.avatar}
                                />
                            )
                        }
                    </div>
                </div>
                <EmptySpace height={40}/>
            </div>

            <Footer/>
        </div>
    )
};

export default withRouter(BlogPostPage);

BlogPostPage.propTypes = {};
