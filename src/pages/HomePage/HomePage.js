import React from 'react';
import classes from './HomePage.module.scss';
import { slides } from "../../constants/js/contents";
import HomePageArticles from "../../containers/HomePageArticles/HomePageArticles";
import TitledImages from "../../containers/TitledImages/TitledImages";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import SlideShow from "../../components/SlideShow/SlideShow";
import HomePageMasters from "../../containers/HomePageMasters/HomePageMasters";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Toast } from "../../config/ToastConfig/Toast.config";
import Loading from "../../components/Loading/Loading";
import topWhite from '../../assets/effects/white-top-effect.svg';
import whitePattern from '../../assets/public/white-pattern.png';
import bottomWhite from '../../assets/effects/white-bottom-effect.svg';
import bottomGreen from '../../assets/effects/green-bottom-effect.svg';
import greenPattern from '../../assets/public/green-pattern.png';
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import { strings } from "../../constants/js/strings";
import WorkshopCards from '../../containers/WorkshopCards/WorkshopCards';
import Pagination from '@material-ui/lab/Pagination';
import PrivateLessonsCards from '../../containers/PrivateLessonsCards/PrivateLessonsCards';
const HomePage = props => {
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const [WorkshopCategories, setWorkshopCategories] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [path, setPath] = React.useState('');
    const [selectedTag, setSelectedTag] = React.useState();
    const [allTags, setAllTags] = React.useState();
    // const [selectedTagIndex, setSelectedTagIndex] = React.useState();
    const backendBaseURL = axios.defaults.baseURL;
    let tagInterval;
    let selectedTagIndex = 0
    React.useEffect(() => {
        setLoading(true);
        axios.get('/api/v1.0/tags').then(res => {
            console.log(res.data);
            setLoading(false);
            let tags = res.data.data;
            tags = tags.filter((tag, index) => index < 4);
            setCategories(tags.map(tag => ({
                ...tag,
                src: backendBaseURL + tag.image
            })));
            // setCategories(tags)

            setSelectedTag(tags[0])
            selectedTagIndex =0
            setAllTags(tags)

        }).catch(err => {
            Toast(strings['An error occurred when receiving data!'], 'error');
        });

    }, []);

    // console.log('selectedTag', selectedTag)
    React.useEffect(() => {
        setLoading(true);
        axios.get('/api/v1.0/workshops?group_class=false').then(res => {
            console.log(res.data);
            setLoading(false);
            let workshops = res.data.data;
            setPath(res.data.path);
            setPage(res.data.current_page);
            setPageCount(res.data.last_page - res.data.current_page + 1);
            setWorkshopCategories(workshops.map(workshop => ({
                slug: workshop.slug,
                title: workshop.title,
                img: backendBaseURL + workshop.banner,
                age : JSON.parse(workshop.json).age,
                desc:workshop.desc,
                price: workshop.price,
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
            setWorkshopCategories(workshops.map(workshop => ({
                slug: workshop.slug,
                title: workshop.title,
                img: backendBaseURL + workshop.banner,
                price: workshop.price,
                desc: workshop.desc,
                sessions: workshop.sessions.length,
                by: workshop.staff?.user?.name + ' ' + workshop.staff?.user?.family
            })));
            // if (res.data?.data?.length === 0) setShowNotFoundMessage(true);
        }).catch(err => {
            setLoading(false);
            // setShowNotFoundMessage(true);
            Toast(strings['An error occurred when receiving data!'], 'error');
        });
    };

    const changeTag = () => {
        if (selectedTagIndex === allTags.length - 1) {
            setSelectedTag(allTags[0])
            selectedTagIndex=0
        } else {
            setSelectedTag(allTags[parseInt(selectedTagIndex) + 1])
            selectedTagIndex=parseInt(selectedTagIndex) + 1
        }
        console.log('donee', parseInt(selectedTagIndex) + 1)
    }

    React.useEffect(() => {
        if (allTags) {
            tagInterval = setInterval(changeTag, 5000);
        }
        console.log('started')
        return () => clearInterval(tagInterval)
    }, [allTags])

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20} />
            <Header />
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <SlideShow slides={slides} />
            <TransitionEffect stickTo={'bottom'} image={bottomWhite} />
            <EmptySpace height={40} />
            <h2 style={{ color: '#FF7200' }}>{strings['Our Services']}</h2>
            <EmptySpace height={20} />
            <Loading color={'#FF7200'} isLoading={loading} height={200} />
            <TitledImages
                noBorder
                countries
                responsive
                baseUrl={'/Categories'}
                items={categories}
                handleClick={(item) => {
                    setSelectedTag(item)
                    selectedTagIndex=allTags.indexOf(item)
                    // console.log(item)
                }}
                selectedItemIndex={selectedTagIndex}
                selectedItem={selectedTag}
            />
            <EmptySpace height={20} />
            <TransitionEffect stickTo={'top'} image={topWhite} />
            {/*<EmptySpace height={40}/>*/}
            {/*<Button style={{padding: 5, width: 150}} onClick={() => props.history.push('/Categories/آموزش-موسیقی/مشاوره-رایگان')}>*/}
            {/*    <img className={classes.headsetIcon} src={headset} alt={""}/>*/}
            {/*    <div>مشاوره رایگان</div>*/}
            {/*</Button>*/}
            { selectedTag && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#32ccff', width: '100%', textAlign: 'center' }}>
                <EmptySpace height={60} />
                <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>{selectedTag?.name}</h2>
                <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>Online Private Lessons</h2>
                <EmptySpace height={20} />
                {/* <HomePageArticles {...props}/> */}
                <PrivateLessonsCards alignLeft baseUrl={'/Workshops'} items={selectedTag} />


                <EmptySpace height={40} />


            </div>}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#80BA5E', backgroundImage: `url(${greenPattern})`, width: '100%', textAlign: 'center' }}>
                <EmptySpace height={60} />
                <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>{strings['Upcoming Online Workshops']}</h2>
                <EmptySpace height={20} />
                {/* <HomePageArticles {...props}/> */}
                <WorkshopCards alignLeft baseUrl={'/Workshops'} items={WorkshopCategories} />
                {
                    !loading && (
                        <Pagination
                            style={{ display: 'inline-block', margin: '0 auto' }}
                            page={page}
                            count={pageCount}
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    )
                }
                <EmptySpace height={40} />
                {/* <TransitionEffect stickTo={'bottom'} image={bottomGreen} /> */}
                <TransitionEffect stickTo={'bottom'} image={bottomWhite} />

            </div>

            <div style={{
                // backgroundColor: '#80BA5E', 
                backgroundColor: '#fff',
                width: '100%',
                backgroundImage: `url(${whitePattern})`
            }}>
                {/* <TransitionEffect stickTo={'bottom'} image={topWhite} /> */}

                <EmptySpace height={40} />

                <h2 style={{ color: '#FF7200', textAlign: 'center' }}>{strings['Teaching Team']}</h2>
                <HomePageMasters />
                <EmptySpace height={40} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#32ccff', width: '100%', textAlign: 'center' }}>
                <EmptySpace height={60} />
                <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>{strings['Blog Last Articles']}</h2>
                <EmptySpace height={20} />
                {/* <HomePageArticles {...props}/> */}
                <HomePageArticles {...props} />
                <EmptySpace height={40} />
                <TransitionEffect stickTo={'bottom'} image={bottomGreen} />
            </div>
            <Footer />
        </div>
    )
};

export default withRouter(HomePage);

HomePage.propTypes = {};
