import React from 'react';
import classes from './OnlineClassPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import ReadMoreArticle from "../../containers/ReadMoreArticle/ReadMoreArticle";
import axios from 'axios';
import VerticalMasterReserveCards from "../../containers/VerticalMasterReserveCards/VerticalMasterReserveCards";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import topWhite from "../../assets/effects/white-top-effect.svg";
import {strings} from "../../constants/js/strings";

const OnlineClassPage = props => {

    const [pack, setPack] = React.useState({});
    const [staffs, setStaffs] = React.useState();
    const backendBaseURL = axios.defaults.baseURL;

    React.useEffect(() => {
        axios.get(`api/v1.0/packages/${props.match.params.staffPackageSlug}`).then(res => {
            setPack({...res.data.data.package, image : backendBaseURL + res.data.data.package.image});
            console.log(res.data.data.staffs)
            setStaffs(res.data.data.staffs.map(staff => ({
                name: `${staff.user.name} ${staff.user.family}`,
                photo: backendBaseURL + staff.user.avatar,
                buttonText: strings['Reserve Class'],
                slug: staff.slug,
                bio: staff.biography,
                lastRowText: ''
                // lastRowText: 'روز های کلاس: ' + ['یکشنبه', 'دوشنبه'].join(' - ')
            })));
            console.log(res.data);
        }).catch(err => {
        });
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor: '#00ccff', width: '100%', textAlign: 'center'}}>
                <EmptySpace height={100}/>

                    <ReadMoreArticle body={pack.text} photo={pack.image} />

                    <h2 className={classes.title}>{strings['Teachers Of This Lesson']}</h2>
                    <EmptySpace height={20}/>

                    <VerticalMasterReserveCards baseUrl={'/masters'} items={staffs}/>
                <EmptySpace height={40}/>
            </div>
            <Footer/>
        </div>
    )
};

export default OnlineClassPage;

OnlineClassPage.propTypes = {};
