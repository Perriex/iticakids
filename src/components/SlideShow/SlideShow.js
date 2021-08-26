import React from 'react';
import {Carousel} from "react-bootstrap";
import classes from './SlideShow.module.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SlideShow = ({slides}) => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.SlideShowContainer}>
                <Carousel style={{width: '100%'}}>
                    {
                        slides.map(slide => (
                            <Carousel.Item key={slide.imageAlt + '_' + Math.random()}>
                                <img
                                    className="d-block w-100"
                                    src={slide.image}
                                    alt={slide.imageAlt}
                                />
                            </Carousel.Item>
                        ))
                    }
                </Carousel>
            </div>
        </div>
    )
};
export default SlideShow;
