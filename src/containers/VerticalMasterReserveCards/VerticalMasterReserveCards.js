import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './VerticalMasterReserveCards.module.scss';
import MasterReserveCard from "../../components/MasterReserveCard/MasterReserveCard";
import Loading from "../../components/Loading/Loading";
import VerticalMasterReserveCard from "../../components/VerticalMasterReserveCard/VerticalMasterReserveCard";

const VerticalMasterReserveCards = props => {
    console.log(props.items);
    return (
        <div className={classes.wrapper}>
            {
                props.items ? (
                    props.items.map(item => (
                            <VerticalMasterReserveCard
                                key={JSON.stringify(item) + Math.random()}
                                photo={item.photo}
                                name={item.name}
                                buttonText={item.buttonText}
                                linkTo={`${props.baseUrl}/${item.slug}`}
                                bio={item.bio}
                                lastRowText={item.lastRowText}
                            />
                        )
                    )
                ) : <Loading isLoading={true} height={200}/>
            }
        </div>
    )
};


export default (VerticalMasterReserveCards);

VerticalMasterReserveCards.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            photo: PropTypes.string,
            name: PropTypes.string,
            buttonText: PropTypes.string,
            slug: PropTypes.string,
            bio: PropTypes.string,
            lastRowText: PropTypes.string,
        })
    ),
    baseUrl: PropTypes.string
};
