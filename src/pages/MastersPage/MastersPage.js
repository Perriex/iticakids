import React from 'react';
import classes from './MastersPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import MasterReserveCards from "../../containers/MasterReserveCards/MasterReserveCards";
import {strings} from "../../constants/js/strings";


const MastersPage = props => {

    const [masters, setMasters] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const backendBaseURL = axios.defaults.baseURL;

    React.useEffect(() => {
        setLoading(true);
        axios.get('api/v1.0/staffs').then(res => {
            console.log(res.data.data);
            setLoading(false);

            setMasters(res.data.data.map(staff => ({
                name: `${staff.name} ${staff.family}`,
                photo: backendBaseURL + staff.avatar,
                buttonText: strings['Class Reserve'],
                slug: staff.slug
            })));
        }).catch(err => {

        });
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <EmptySpace height={40}/>
            <h2 className={classes.title}>مدرسین مشق عشق</h2>
            <EmptySpace height={40}/>
            <Loading isLoading={loading} height={200}/>
            {/*<TitledImages responsive baseUrl={'/onlineClasses'} items={onlineClasses}/>*/}
            <MasterReserveCards baseUrl={'/masters'} items={masters}/>
            <EmptySpace height={40}/>
            <Footer/>
        </div>
    )
};

export default (MastersPage);

MastersPage.propTypes = {};
