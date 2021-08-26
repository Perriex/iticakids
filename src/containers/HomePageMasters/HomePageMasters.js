import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './HomePageMasters.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import {withRouter} from 'react-router-dom';
import {Button as MUIButton} from '@material-ui/core';
import {strings} from "../../constants/js/strings";
import TitledImages from "../TitledImages/TitledImages";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

const HomePageMasters = props => {
    const [loading, setLoading] = React.useState(false);
    const [masters, setMasters] = React.useState([]);
    React.useEffect(() => {
        setLoading(true);
        axios.get('/api/v1.0/staffs').then(res => {
            setLoading(false);
            setMasters(res.data.data.map(staff => ({
                src: axios.defaults.baseURL + staff.avatar,
                buttonText: strings['Reserve Class'],
                title:staff.name+' '+staff.family,
                slug:staff.slug,             
            })).filter((item, index) => index < 6));
        }).catch(err => {
            setLoading(false);
        });
    }, []);
    return (
        <div className={classes.wrapper}>
            <EmptySpace height={40} />
            {loading && <Loading color={'white'} isLoading={loading} height={200} />}
            <TitledImages noBorder items={masters} />
            <EmptySpace height={40} />
            <MUIButton style={{backgroundColor: '#008C99', width: 170, margin: 'auto', color: 'white'}} onClick={() => props.history.push('/About')}>
                {strings['Rhythmitica Staffs']}
            </MUIButton>
            <EmptySpace height={40} />
        </div>
    )
};

export default withRouter(HomePageMasters);

HomePageMasters.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string
        })
    ),
};
