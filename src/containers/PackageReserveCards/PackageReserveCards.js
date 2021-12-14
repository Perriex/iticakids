import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './PackageReserveCards.module.scss';
import TitledImage from "../../components/TitledImage/TitledImage";
import ClassReserveCard from "../../components/ClassReserveCard/ClassReserveCard";
import {withRouter} from 'react-router-dom';

const PackageReserveCards = props => {

    return (
        <div className={classes.wrapper}>
            {
                props.items && props.items.map(item => (
                    <ClassReserveCard
                        onButtonClick={() => {
                            props.history.push({
                                pathname: `/masters/${props.baseURL}/${item.slug}`,
                                state: { staffPackageId: item.id }
                            });
                        }}
                        key={JSON.stringify(item) + Math.random()}
                        photo={item.photo}
                        buttonText={item.buttonText}
                        title={item.title}
                        price={item.price}
                        time={item.time}
                    />
                ))
            }
        </div>
    )
};

export default withRouter(PackageReserveCards);

PackageReserveCards.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            photo: PropTypes.string,
            title: PropTypes.string,
            time: PropTypes.string,
            price: PropTypes.string,
            buttonText: PropTypes.string,
            slug: PropTypes.string,
            id: PropTypes.number,
        })
    ),
    baseURL: PropTypes.string,
    routerState: PropTypes.any,
};
