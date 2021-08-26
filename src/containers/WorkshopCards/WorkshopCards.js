import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './WorkshopCards.module.scss';
import {withRouter} from "react-router";
import WorkshopCard from "../../components/WorkshopCard/WorkshopCard";
import EmptySpace from "../../components/EmptySpace/EmptySpace";

const WorkshopCards = props => {
    const handleClick = (id) => props.history.push(`${props.baseUrl}/${id}`);
    const Empties = [];
    for (let i = 0; i < 50; i++) {
        Empties.push(i);
    }
    console.log('ite',props.items)
    return (
        <div className={classes.wrapper}>
            {
                props.items && props.items.map(item => (
                    <WorkshopCard
                        responsive={props.responsive}
                        key={JSON.stringify(item) + Math.random()}
                        title={item.title}
                        img={item.img}
                        by={item.by}
                        age={item.age}
                        desc={item.desc}
                        sessions={item.sessions}
                        lang={item.lang}
                        age={item.age}
                        price={item.price}
                        buttonText={item.buttonText}
                        onClick={() => handleClick(item.slug)}
                    />
                ))
            }
            {
                props.alignLeft && (
                    Empties.map(item => {
                        return <EmptySpace height={0} width={285}
                            responsive={props.responsive}
                            key={JSON.stringify(item) + Math.random()}
                            title={item.title}
                            src={item.src}
                            onClick={() => handleClick(item.id)}
                        />
                    })
                )
            }
        </div>
    )
};

export default withRouter(WorkshopCards);

WorkshopCards.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            img: PropTypes.string,
            title: PropTypes.string,
            by: PropTypes.string,
            sessions: PropTypes.number,
            price: PropTypes.number,
            buttonText: PropTypes.string,
            slug: PropTypes.string,
            onClick: PropTypes.func,
            responsive: PropTypes.bool,
        })
    ),
    baseUrl: PropTypes.string,
    responsive: PropTypes.bool,
    alignLeft: PropTypes.bool,
};
