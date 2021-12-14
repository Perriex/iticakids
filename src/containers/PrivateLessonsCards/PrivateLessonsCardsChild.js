import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './WorkshopCards.module.scss';
import { withRouter } from "react-router";
import WorkshopCard from "../../components/WorkshopCard/WorkshopCard";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import axios from 'axios';
import PrivateLessonCard from '../../components/PrivateLessonCard/PrivateLessonCard';
import { Link } from '@material-ui/core';
const PrivateLessonsCardsChild = ({item,...props}) => {
    const backendBaseURL = axios.defaults.baseURL;

    return (
        <div className={classes.wrapper}>

            {item.staff_packages.map((pack) => {
                return (<PrivateLessonCard
                    responsive={props.responsive}
                    key={JSON.stringify(item) + Math.random()}
                    title={item.name}
                    img={backendBaseURL + item.image}
                    by={pack?.staff_user.user.name + ' ' + pack?.staff_user.user?.family}
                    language={JSON.parse(item.json).language}
                    age={JSON.parse(item.json).age}
                    sessions={item.sessions}
                    price={"$" + pack?.price + '/' + pack?.duration + ' min'}
                    buttonText={item.buttonText}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        props.history.push({
                            pathname: `/masters/${pack.staff_user.slug}/reservePackage/${item.slug}`,
                            state: { staffPackageId: pack.id }
                        });
                    }}
                />)
            })}



        </div>
    )
};

export default PrivateLessonsCardsChild;
