import React from 'react';
import classes from './CategoriesPage.module.scss';
import TitledImages from "../../containers/TitledImages/TitledImages";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import { Toast } from '../../config/ToastConfig/Toast.config.js';
import topWhite from "../../assets/effects/white-top-effect.svg";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import { strings } from "../../constants/js/strings";
import PrivateLessonsCards from '../../containers/PrivateLessonsCards/PrivateLessonsCards';
import greenPattern from '../../assets/public/green-pattern.png';

const CategoriesPage = props => {

    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const backendBaseURL = axios.defaults.baseURL;
    const [selectedTag, setSelectedTag] = React.useState();
    const [allTags, setAllTags] = React.useState();

    let tagInterval;
    let selectedTagIndex = 0
    React.useEffect(() => {
        setLoading(true);
        axios.get('/api/v1.0/tags').then(res => {
            console.log(res.data);
            setLoading(false);
            let tags = res.data.data;
            // tags = tags.filter(k => k.packages_count > 0);

            setCategories(tags.map(tag => ({
                ...tag,
                src: backendBaseURL + tag.image
            })));
            setSelectedTag(tags[0])
            selectedTagIndex = 0
            setAllTags(tags)

        }).catch(err => {
            Toast(strings['An error occurred when receiving data!'], 'error');
        });
    }, []);

    const changeTag = () => {
        if (selectedTagIndex === allTags.length - 1) {
            setSelectedTag(allTags[0])
            selectedTagIndex = 0
        } else {
            setSelectedTag(allTags[parseInt(selectedTagIndex) + 1])
            selectedTagIndex = parseInt(selectedTagIndex) + 1
        }
        console.log('donee', parseInt(selectedTagIndex) + 1)
    }

    React.useEffect(() => {
        if (allTags) {
            tagInterval = setInterval(changeTag, 10000);
        }
        console.log('started')
        return () => clearInterval(tagInterval)
    }, [allTags])
    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20} />
            <Header />
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#32ccff', width: '100%', textAlign: 'center' }}>
                <EmptySpace height={80} />
                <h2 className={classes.title}>{strings['Categories']}</h2>
                <EmptySpace height={20} />

                <Loading isLoading={loading} height={200} />
                {/*<TitledImages responsive baseUrl={'/onlineClasses'} items={onlineClasses}/>*/}
                {/*<TitledImages alignLeft responsive baseUrl={'/onlineClasses'} items={onlineClassesArr}/>*/}
                {/* <TitledImages alignLeft baseUrl={'/Categories'} responsive items={categories}/> */}
                <TitledImages
                    noBorder
                    countries
                    responsive
                    baseUrl={'/Categories'}
                    items={categories}
                    handleClick={(item) => {
                        setSelectedTag(item)
                        selectedTagIndex = allTags.indexOf(item)
                        console.log('item', item)
                        console.log('selectedTagIndex', allTags.indexOf(item))
                    }}
                />
                <EmptySpace height={80} />
                {/* <TransitionEffect stickTo={'top'} image={topWhite} /> */}
                {selectedTag &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#80BA5E', backgroundImage: `url(${greenPattern})`, width: '100%', textAlign: 'center' }}>
                        <EmptySpace height={60} />
                        <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>{selectedTag?.name}</h2>
                        <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>Online Private Lessons</h2>
                        <EmptySpace height={20} />
                        {/* <HomePageArticles {...props}/> */}
                        <PrivateLessonsCards alignLeft baseUrl={'/Workshops'} items={selectedTag} />


                        <EmptySpace height={40} />


                    </div>}
            </div>
            <Footer />
        </div>
    )
};

export default CategoriesPage;

CategoriesPage.propTypes = {};
