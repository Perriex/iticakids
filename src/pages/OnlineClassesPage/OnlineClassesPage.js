import React from 'react';
import classes from './OnlineClassesPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import VerticalMasterReserveCards from "../../containers/VerticalMasterReserveCards/VerticalMasterReserveCards";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import topWhite from "../../assets/effects/white-top-effect.svg";
import {strings} from "../../constants/js/strings";

const OnlineClassesPage = props => {

    const [onlineClassesArr, setOnlineClassesArr] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const backendBaseURL = axios.defaults.baseURL;
    const [data, setData] = React.useState({});

    React.useEffect(() => {
        setLoading(true);
        axios.get(`/api/v1.0/tags/${props.match.params.categorySlug}`).then(res => {
            console.log(res.data);
            setData(res.data.data);
            console.log(res.data.data);
            setOnlineClassesArr(res.data.data.packages.map(staff => ({
                name: staff.name,
                photo: backendBaseURL + staff.image,
                buttonText: strings['Checkout'],
                slug: staff.slug,
                bio: staff.text,
                //lastRowText: `${strings['Teachers Count']}: ` + staff.staffs_count
            })));
        }).then(res => {
            setLoading(false);
        });

    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor: '#17b361', width: '100%', textAlign: 'center'}}>
                <EmptySpace height={80}/>
                <h2 className={classes.title}>{data.name}</h2>
                <EmptySpace height={40}/>
                <Loading isLoading={loading} height={200} />
                {/*<TitledImages responsive baseUrl={'/onlineClasses'} items={onlineClasses}/>*/}
                <VerticalMasterReserveCards baseUrl={'/Categories/' + props.match.params.categorySlug} items={onlineClassesArr}/>
                {/*<TitledImages alignLeft responsive baseUrl={'/Categories/' + props.match.params.categorySlug} items={onlineClassesArr}/>*/}
                <EmptySpace height={40}/>
            </div>
            <Footer/>
        </div>
    )
};

export default OnlineClassesPage;

OnlineClassesPage.propTypes = {};
