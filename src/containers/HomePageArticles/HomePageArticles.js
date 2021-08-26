import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './HomePageArticles.module.scss';
import {Post} from '../../pages/Blog/Blog';
import Loading from "../../components/Loading/Loading";
import axios from 'axios';

const HomePageArticles = props => {
    const [loading, setLoading] = React.useState(false);
    const [articles, setArticles] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        axios
            .get('/api/v1.0/blog/posts?length=3')
            .then(res => {
                console.log(res.data.data);
                setArticles(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }, []);
    return (
        <div className={classes.wrapper}>
            {loading && <Loading height={400} isLoading={loading} />}
            {
                articles?.map(item => (
                    <Post
                        key={Math.random()}
                        style={{width: 280, margin: '5px'}}
                        image={axios.defaults.baseURL + item.banner}
                        body={item.body}
                        title={item.title}
                    />
                ))
            }
        </div>
    )
};

export default HomePageArticles;

HomePageArticles.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string
        })
    ),
};
