import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './WorkshopCards.module.scss';
import { withRouter } from "react-router";
import WorkshopCard from "../../components/WorkshopCard/WorkshopCard";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import axios from 'axios';
import PrivateLessonCard from '../../components/PrivateLessonCard/PrivateLessonCard';
import { Link } from '@material-ui/core';
const PrivateLessonsCards = props => {
    const handleClick = (id) => props.history.push(`${props.baseUrl}/${id}`);
    const backendBaseURL = axios.defaults.baseURL;
    const Empties = [];
    for (let i = 0; i < 50; i++) {
        Empties.push(i);
    }
    
    return (
        <div className={classes.wrapper}>
            {
                props.items?.packages && props.items?.packages.map(item => {
                    if (item.staff_packages.length > 0
                    ) {
                        return (
                            <PrivateLessonCard
                                responsive={props.responsive}
                                key={JSON.stringify(item) + Math.random()}
                                title={item.name}
                                img={backendBaseURL + item.image}
                                by={item?.staff_packages[0]?.staff_user.user.name+' '+item?.staff_packages[0]?.staff_user.user?.family}
                                language={JSON.parse(item.json).language}
                                age={JSON.parse(item.json).age}
                                sessions={item.sessions}
                                price={"$"+item?.staff_packages[0]?.price + '/' + item?.staff_packages[0]?.duration + ' min'}
                                buttonText={item.buttonText}
                                style={{cursor: 'pointer'}}
                                onClick={() => {
                                    props.history.push({
                                        pathname: `/masters/${item.staff_packages[0].staff_user.slug}/reservePackage/${item.slug}`,
                                        state: {staffPackageId: item.staff_packages[0]?.id}
                                    });
                                }}
                            />
                        )
                    }
                })
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

export default withRouter(PrivateLessonsCards);

PrivateLessonsCards.propTypes = {
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
