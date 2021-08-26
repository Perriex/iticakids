import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './MasterReserveCards.module.scss';
import MasterReserveCard from "../../components/MasterReserveCard/MasterReserveCard";
import Loading from "../../components/Loading/Loading";
const MasterReserveCards = props => {
    return (
        <div className={classes.wrapper}>
            {
                props.items ? (
                    props.items.map(item => (
                            <MasterReserveCard
                                key={JSON.stringify(item) + Math.random()}
                                photo={item.photo}
                                name={item.name}
                                buttonText={item.buttonText}
                                linkTo={`${props.baseUrl}/${item.slug}`}
                            />
                        )
                    )
                ) : <Loading isLoading={true} height={200}/>
            }
        </div>
    )
};



export default (MasterReserveCards);

MasterReserveCards.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            photo: PropTypes.string,
            name: PropTypes.string,
            buttonText: PropTypes.string,
            slug: PropTypes.string
        })
    ),
    baseUrl: PropTypes.string
};
