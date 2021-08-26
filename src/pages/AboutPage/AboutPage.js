import React from 'react';
import classes from './AboutPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import VerticalMasterReserveCards from "../../containers/VerticalMasterReserveCards/VerticalMasterReserveCards";
import {strings} from "../../constants/js/strings";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import topWhite from "../../assets/effects/white-top-effect.svg";
import greenPattern from "../../assets/public/green-pattern.png";
import HomePageMasters from "../../containers/HomePageMasters/HomePageMasters";
import bottomGreen from "../../assets/effects/green-bottom-effect.svg";

const AboutPage = props => {

    const [loading, setLoading] = React.useState(false);
    const backendBaseURL = axios.defaults.baseURL;
    const [masters, setMasters] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        axios.get('/api/v1.0/staffs').then(res => {
            console.log(res.data.data);
            setLoading(false);
            setMasters(res.data.data.map(staff => ({
                name: `${staff.name} ${staff.family}`,
                photo: backendBaseURL + staff.avatar,
                buttonText: strings['Reserve Class'],
                slug: staff.slug,
                bio: staff.biography,
                lastRowText: ''
            })));
        }).catch(err => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{backgroundColor: '#2ab361', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                <div className={classes.textWrapper}>
                    <EmptySpace height={80}/>
                    <h2 className={classes.title}>{strings['About Rhythmitica Kids']}</h2>
                    <EmptySpace height={40}/>
                    {strings.variables.aboutPageText}
                </div>
                <EmptySpace height={80}/>
                <TransitionEffect stickTo={'bottom'} image={bottomGreen} />
            </div>
            <div style={{backgroundColor: '#80BA5E', width: '100%', backgroundImage: `url(${greenPattern})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <EmptySpace height={40}/>
                <h2 className={classes.title}>{strings['Teachers']}</h2>
                <Loading isLoading={loading} height={200}/>
                <EmptySpace height={40}/>
                <VerticalMasterReserveCards baseUrl={'/masters'} items={masters}/>
                <EmptySpace height={40}/>
            </div>
            <Footer/>
        </div>
    )
};

export default AboutPage;

AboutPage.propTypes = {};
