import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Images.module.scss';
import ImageCard from "../../components/ImageCard/ImageCard";
import BlindPagination from "../../components/BlindPagination/BlindPagination";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {slides} from "../../constants/js/contents";
import TitledImage from "../../components/TitledImage/TitledImage";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {IconButton} from "@material-ui/core";


const MenuItem = ({text, selected, item}) => {
    return <div className={`menu-item ${selected ? 'active' : ''}`}>
        <TitledImage style={{width: 150, height: 150}} src={item.photo} noBorder/>
    </div>
};

const Menu = (list, selected) => {
    return list.map((item) => (
        <MenuItem
            item={item}
            selected={selected}
            key={JSON.stringify(item) + Math.random()}
        />
    ));
};


const Arrow = ({el, className}) => <div className={className}>{el}</div>;

const ArrowLeft = Arrow({
    el: (
        <IconButton style={{color: '#FFFFFF', width: 30, height: 30}} color="primary"
                    aria-label="upload picture" component="span">
            <NavigateBeforeIcon style={{color: '#FFFFFF', width: 30, height: 30}}/>
        </IconButton>
    ), className: classes.Arrow
});
const ArrowRight = Arrow({
    el: (
        <IconButton style={{color: '#FFFFFF', width: 30, height: 30}} color="primary"
                    aria-label="upload picture" component="span">
            <NavigateNextIcon style={{color: '#FFFFFF', width: 30, height: 30}}/>
        </IconButton>
    ), className: classes.Arrow
});


const Images = props => {
    const [page, setPage] = React.useState(0);
    const [selected, setSelected] = React.useState('item1');
    const menuItems = Menu(props.items, selected);

    const onSelect = key => {
        setSelected(key);
    };

    const handleTranslate = ({translate}) => {
        // console.log(translate);
        const activePage = Math.abs(translate) / 160;
        // console.log("------" + Number(activePage.toFixed()));
        setPage(Number(activePage.toFixed()));
        // console.log(`translate: ${translate}\n activePage: ${activePage}`);
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.cards}>
                <ScrollMenu
                    onUpdate={handleTranslate}
                    translate={10}
                    data={menuItems}
                    arrowLeft={ArrowLeft}
                    arrowRight={ArrowRight}
                    selected={selected}
                    onSelect={onSelect}
                    wheel={false}
                />
            </div>
            <BlindPagination
                activePage={page}
                pageCount={props.items.length}
                onPageChange={index => setPage(index)}
            />
        </div>
    )
};

export default Images;

Images.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            photo: PropTypes.string
        })
    ),
    page: PropTypes.number,
    perPage: PropTypes.number
};
