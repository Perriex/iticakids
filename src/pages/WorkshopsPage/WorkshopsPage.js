import React from 'react';
import classes from './WorkshopsPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import {Toast} from '../../config/ToastConfig/Toast.config.js';
import WorkshopCards from "../../containers/WorkshopCards/WorkshopCards";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import bottomGreen from "../../assets/effects/green-bottom-effect.svg";
import greenPattern from "../../assets/public/green-pattern.png";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import {strings} from "../../constants/js/strings";

const WorkshopsPage = props => {

    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [path, setPath] = React.useState('');
    const backendBaseURL = axios.defaults.baseURL;

    React.useEffect(() => {
        setLoading(true);
        axios.get('/api/v1.0/workshops?group_class=false').then(res => {
            console.log(res.data);
            setLoading(false);
            let workshops = res.data.data;
            setPath(res.data.path);
            setPage(res.data.current_page);
            setPageCount(res.data.last_page - res.data.current_page + 1);
            setCategories(workshops.map(workshop => ({
                slug: workshop.slug,
                title: workshop.title,
                img: backendBaseURL + workshop.banner,
                price: workshop.price,
                age : JSON.parse(workshop.json).age,
                desc:workshop.desc,
                lang: workshop.lang,
                sessions: workshop.sessions.length,
                by: workshop.staff?.user?.name + ' ' + workshop.staff?.user?.family
            })));
        }).catch(err => {
            Toast(strings['An error occurred when receiving data!'], 'error');
        });
    }, []);

    const handlePageChange = (e, number) => {
        setPage(number);

        setLoading(true);
        const postsUrl = `${path}=${number}`;
        axios.get(postsUrl).then(res => {
            console.log(res.data);
            setLoading(false);
            let workshops = res.data.data;
            setPath(res.data.path);
            setPage(res.data.current_page);
            setPageCount(res.data.last_page - res.data.current_page + 1);
            setCategories(workshops.map(workshop => ({
                slug: workshop.slug,
                title: workshop.title,
                img: backendBaseURL + workshop.banner,
                price: workshop.price,
                sessions: workshop.sessions.length,
                by: workshop.staff?.user?.name + ' ' + workshop.staff?.user?.family
            })));
            // if (res.data?.data?.length === 0) setShowNotFoundMessage(true);
        }).catch(err => {
            setLoading(false);
            // setShowNotFoundMessage(true);
            Toast(strings['An error occurred when receiving data!'],'error');
        });
    };

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20}/>
            <Header/>
            <EmptySpace height={30}/>
            {/*<h2 className={classes.title}>ورکشاپ ها</h2>*/}
            <TransitionEffect stickTo={'bottom'} image={bottomGreen}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#80BA5E',
                width: '100%',
                textAlign: 'center',
                backgroundImage: `url(${greenPattern})`
            }}>
                <EmptySpace height={40}/>
                <Loading isLoading={loading} height={200}/>
                <WorkshopCards alignLeft baseUrl={'/Workshops'} items={categories}/>
                {
                    !loading && (
                        <Pagination
                            style={{display: 'inline-block', margin: '0 auto'}}
                            page={page}
                            count={pageCount}
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    )
                }
                <EmptySpace height={50}/>
            </div>
            <Footer/>
        </div>
    )
};

export default WorkshopsPage;

WorkshopsPage.propTypes = {};
