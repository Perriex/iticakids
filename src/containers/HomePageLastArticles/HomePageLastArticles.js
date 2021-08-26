import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './HomePageLastArticles.module.scss';
import ArticleCard from "../../components/ArticleCard/ArticleCard";

const HomePageLastArticles = props => {
    return (
        <div className={classes.wrapper}>
            {
                props.items && props.items.map(item => (
                    <ArticleCard
                        key={JSON.stringify(item) + Math.random()}
                        title={item.title}
                        body={item.body}
                        buttonText={item.buttonText}
                    />
                ))
            }
        </div>
    )
};

export default HomePageLastArticles;

HomePageLastArticles.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string,
            buttonText: PropTypes.string
        })
    ),
};
