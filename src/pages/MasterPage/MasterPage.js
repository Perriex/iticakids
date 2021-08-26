import React from 'react';
import classes from './MasterPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import PackageReserveCards from "../../containers/PackageReserveCards/PackageReserveCards";
import ReadMoreArticle from "../../containers/ReadMoreArticle/ReadMoreArticle";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import { connect } from 'react-redux';
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import topWhite from "../../assets/effects/white-top-effect.svg";
import { strings } from "../../constants/js/strings";
import MasterInfo from '../../containers/MasterInfo/MasterInfo';

const numberFormat = value => {
    let val = (value + '').replace(/,/g, '').trim().split("").reverse().join(""), res = '';
    for (let i = 0; i < val.length; i++) {
        res += i % 3 === 0 && i !== 0 ? ',' + val.charAt(i) : val.charAt(i);
    }
    return res.split("").reverse().join("");
};

const MasterPage = props => {

    const [staff, setStaff] = React.useState();
    const [packs, setPacks] = React.useState();
    const [selectedDuration, setSelectedDuration] = React.useState();
    const [durations, setDurations] = React.useState([]);
    const backendBaseURL = axios.defaults.baseURL;

    React.useEffect(() => {
        axios.get(`api/v1.0/staffs/${props.match.params.id}`)
            .then(res => {
                console.log(res.data);
                setStaff(res.data.data.staff);
                let packs = res.data.data.staff.packages;
                let times = [...new Set(packs.map(pack => (pack.duration)))];
                setDurations(times);
                if (times.length > 0)
                    setSelectedDuration(times[0]);
                console.log(times);
            })
            .catch(err => {
            });
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20} />
            <Header />
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#00ccff', width: '100%', textAlign: 'center' }}>
                <EmptySpace height={100} />

                {staff ? <MasterInfo
                    name={staff ? staff.name + ' ' + staff.family : ""}
                    body={staff ? staff.biography : ''}
                    photo={staff ? backendBaseURL + staff.avatar : ''}
                    json={staff ? JSON.parse(staff.json) : {}}
                /> :
                    <Loading height={200} isLoading />
                }


                <h2 className={classes.title}>{strings['Packages Of This Teacher']}</h2>
                <EmptySpace height={20} />

                {
                    staff ? (
                        <>
                            {/*
                            !isMobile && (
                                <div className={classes.timesContainer}>
                                    مدت دوره را انتخاب کنید:
                                    <div className={classes.times}>
                                        {
                                            durations.map(duration => (
                                                <Clock
                                                    key={duration}
                                                    value={duration}
                                                    active={duration === selectedDuration}
                                                    onSelect={setSelectedDuration.bind(this, duration)}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            )*/
                            }
                            <PackageReserveCards
                                baseURL={`${props.match.params.id}/reservePackage`}
                                routerState={{ staffId: staff.id }}
                                items={
                                    staff && staff.packages./*filter(item => isMobile || item.duration === selectedDuration).*/map(item => ({
                                        photo: backendBaseURL + item.package.image,
                                        title: item.package.name,
                                        time: `${item.duration} min`,
                                        price: `${'$'}${item.price}`,
                                        buttonText: strings['Reserve'],
                                        slug: item.package.slug,
                                        id: item.id
                                    }))
                                }
                            />
                        </>
                    ) : <Loading height={200} isLoading />
                }
                <EmptySpace height={65} />
            </div>
            <Footer />
        </div>
    )
};
const mapStateToProps = state => ({ isIran: state.isIran });

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MasterPage);

MasterPage.propTypes = {};
