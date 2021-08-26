import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './TitledImages.module.scss';
import TitledImage from "../../components/TitledImage/TitledImage";
import { withRouter } from "react-router";
import EmptyTitledImage from "../../components/EmptyTitledImage/EmptyTitledImage";
import { getColorOfIndex } from "../../constants/js/functions";

const TitledImages = props => {
    const handleClick = (slug , item) => {
        if (props.countries) { 

            props.handleClick(item)
        }
        else {
            console.log('css')
            !props.noLink && props.history.push(`/masters/${slug}`);

        }

    }
    const Empties = [];
    for (let i = 0; i < 50; i++) {
        Empties.push(i);
    }

    return (
        <div className={classes.wrapper}>
            {
                props.items && props.items.map((item, index) => (
                    <TitledImage
                        backgroundColor={getColorOfIndex(index)}
                        noBorder={props.noBorder}
                        active={props.selectedItem?.id==item.id}
                        responsive={props.responsive}
                        key={JSON.stringify(item) + Math.random()}
                        title={item.title}
                        name={item.name}
                        src={item.src}
                        onClick={() => handleClick(item.slug , item)}
                    />
                ))
            }
            {
                props.alignLeft && (
                    Empties.map(item => {
                        return <EmptyTitledImage
                            responsive={props.responsive}
                            noBorder={props.noBorder}
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

export default withRouter(TitledImages);

TitledImages.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            src: PropTypes.string
        })
    ),
    baseUrl: PropTypes.string,
    responsive: PropTypes.bool,
    noBorder: PropTypes.bool,
    alignLeft: PropTypes.bool,
    noLink: PropTypes.bool,
};
