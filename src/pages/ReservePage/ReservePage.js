import React from 'react';
import classes from './ReservePage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Header from "../../containers/Header/Header";
import ClassDayChooser from "../../components/ClassDayChooser/ClassDayChooser";
import AvailableHours from "../../containers/AvailableHours/AvailableHours";
import TimelineView from "../../components/TimelineView/TimelineView";
import Button from "../../components/Button/Button";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Button as MUIButton, IconButton } from '@material-ui/core';
import axios from 'axios';
import store from "store";
import { Toast } from '../../config/ToastConfig/Toast.config';
import { withRouter } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TitledImage from "../../components/TitledImage/TitledImage";
import Loading from "../../components/Loading/Loading";
import RadioButtons from "../../components/RadioButtons/RadioButtons";
import topWhite from "../../assets/effects/white-top-effect.svg";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import { strings } from "../../constants/js/strings";


const TitleBar = props => {
    return (
        <div className={classes.TitleBar}>
            {props.children}
        </div>
    )
};

const ReservePage = props => {
    const user = store.get('user');
    const token = store.get('token');
    if (!user || !token) {
        props.history.replace('/signIn');
    }

    const [months, setMonths] = React.useState([]);
    const [termsStr, setTermsStr] = React.useState("");
    const [activeDaysSchedule, setActiveDaysSchedule] = React.useState({});
    const [pack, setPack] = React.useState({});
    const [packageTypes, setTypes] = React.useState();
    const [sessionsType, setSessionsType] = React.useState();

    const [sessionsCount, setSessionsCount] = React.useState('1');
    const [activeTab, setActiveTab] = React.useState(strings['Details']);
    const [activeDay, setActiveDay] = React.useState(0);
    const [activeDayHours, setActiveDayHours] = React.useState(null);
    const [activePageIndex, setActivePageIndex] = React.useState(0);
    const [selectedHour, setSelectedHour] = React.useState(null);
    const [timezones, setTimezones] = React.useState([]);
    const [userTimezone, setUserTimezone] = React.useState('');
    const [coupon, setCoupon] = React.useState('');
    const [selectedWeekDay, setSelectedWeekday] = React.useState();
    const [accept, setAccept] = React.useState(false);
    const [country, setCountry] = React.useState('');
    const [isIranianCalendar, setIsIranianCalendar] = React.useState(false);
    const [classTimes, setClassTimesTable] = React.useState([]);
    const [classTimesLoading, setClassTimesLoading] = React.useState(false);
    const [calendarIsLoading, setCalendarIsLoading] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [couponOff, setCouponOff] = React.useState(0);

    const getSessionsCountDiscount = () => (sessionsType !== 'weekly') ? 0 : sessionsCount === '12' ? 0.1 : sessionsCount === '8' ? 0.05 : 0;
    const getTotalPrice = () => sessionsCount * (pack.price);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccept = () => {
        handleClose();
        setAccept(true);
    };

    const calendarPrevButtonClickedHandler = () => {
        daySelectedHandler(0, null);
        setActivePageIndex(activePageIndex - 1);
        setSelectedHour(null);
    };
    const calendarNextButtonClickedHandler = () => {
        daySelectedHandler(0, null);
        setActivePageIndex(activePageIndex + 1);
        setSelectedHour(null);
    };

    const showPolicies = () => {
        if (accept) {
            setAccept(false);
        } else handleClickOpen();
    };

    const mapDayToWeekDay = {
        0: 'Saturday',
        1: 'Sunday',
        2: 'Monday',
        3: 'Tuesday',
        4: 'Wednesday',
        5: 'Thursday',
        6: 'Friday',
    };

    const getPersianWeekDayOf = englishWeekDay => {
        return {
            'Saturday': 'شنبه',
            'Sunday': 'یکشنبه',
            'Monday': 'دوشنبه',
            'Tuesday': 'سه شنبه',
            'Wednesday': 'چهارشنبه',
            'Thursday': 'پنجشنبه',
            'Friday': 'جمعه',
        }[englishWeekDay];
    };

    const daySelectedHandler = (day, index, weekDay) => {
        console.log(index);
        setSelectedWeekday(mapDayToWeekDay[weekDay]);
        setSelectedHour(null);
        setActiveDayHours(index);
        setActiveDay(day);
    };

    const checkTimezone = () => {
        axios.get('api/ip_info').then(res => {
            let userTimezone = store.get('user').timezone;
            const currentTimezone = res.data.timezone;
            if (userTimezone !== currentTimezone) {
                // Toast('برای ثبت سفارش لطفا فیلترشکن خود را خاموش کنید و صفحه را ریفرش کنید!', 'warning');
            }
        }).catch(err => {
        });
    };

    const getAndSetTimezones = () => {
        axios.get('api/timezones').then((res) => {
            setTimezones(res.data);
            axios.get('api/ip_info').then((res) => {
                console.log(res.data);
                setCountry(res.data.country_name);
                handleUserTimeZoneChanged(res.data.timezone);
            }).catch((err) => {
                Toast(strings['Could not get your Timezone! Please select it in "details" section.'], 'error');
            })
        })
    };

    const isCouponPossible = () => {
        return (sessionsType == 'weekly' && sessionsCount < 8)
    };

    const handleReserve = () => {

        if (!accept) {
            Toast(strings['First Accept the terms of services.'], 'error');
            return;
        }
        let notAvailable = false;
        classTimes.map(session => {
            if (!session.valid) notAvailable = true
        });
        if (notAvailable) {
            Toast('Some sessions are reserved!', 'error');
            return;
        }
        let data = {
            staff_package_id: pack.id,
            schedules_count: Number(sessionsCount),
            // schedule_date: selectedWeekDay + ' ' + activeDayHours + ' ' + selectedHour,
            schedule_date: activeDayHours + ' ' + selectedHour,
            timezone: userTimezone,
            coupon: coupon,
            type: sessionsType
        };
        setIsSubmitting(true);
        axios.post('api/v1.0/reserves', data, {
            headers: {
                'Authorization': store.get('token')
            }
        })
            .then(res => {
                setIsSubmitting(false);
                if (parseInt(res.data.data.reserve.paid) === 1 && res.data.data.reserve.reserve_token === null) {
                    Toast(strings['Ordered successfully'], 'success');
                    // props.history.redirect('/dashboard/myPackages');
                    document.location.href = axios.defaults.dashboard + "/myPackages";
                } else {
                    Toast(strings['Ordered successfully'], 'success');
                    // document.location.href = axios.defaults.dashboard + "/myPackages";

                    const reserveToken = res.data.data.reserve.reserve_token;
                    // if (isIran()) {
                    //     document.location.href = `${axios.defaults.baseURL}/pay/booking/zarrin?reserve_token=${reserveToken}`;
                    // } else {

                        //TODO Setting Pending to Non Iranian Users for Mashg'e Eshg
                        // document.location.href = axios.defaults.dashboard + '/mypackages';
                        document.location.href = `${axios.defaults.baseURL}/pay/booking/paypal?reserve_token=${reserveToken}&site_id=7`;
                    // }
                }
            })
            .catch(err => {
                Toast(strings['Could not order!'], 'error');
                setIsSubmitting(false);
            });
    };

    const handleRedeem = () => {
        if (!isCouponPossible()) {
            Toast(strings['You can use discount code just for less than 8 sessions.'], 'error');
            return;
        }
        const data = {
            coupon: coupon,
            staff_package_id: pack.id,
            schedules_count: sessionsCount
        };
        axios.post('/api/v1.0/staffs/checkCoupon', data)
            .then(res => {
                console.log(res);
                if (!res.data.off_percent || res.data.off_percent === 0) {
                    Toast(strings['Invalid Discount Code'], 'error');
                } else {
                    console.log(res.data.off_percent);
                    setCouponOff(res.data.off_percent);
                    Toast(strings['Discount code applied successfully.'], 'success');
                }
            })
        // TODO Redeem
    };

    const isIran = () => country === 'Iran';

    const handleLoadTimes = () => {
        setCalendarIsLoading(true);

        const staffSlug = props.match.params.masterSlug;
        const staffPackageId = props.location.state.staffPackageId;

        axios.post(`api/v1.0/staffs/${staffSlug}/${staffPackageId}/checkTimes`, {
            timezone: timezones.timezone,
            sessionsCount: sessionsCount,
            sessionsType: sessionsType
        }).then(res => {
            console.log('res', res)

            let months = res.data.data.template;
            let schedule = res.data.data.available;
            let emptyIndexes = [];
            res.data.data.template.map((month, index) => {
                if (!month.active_days || month.active_days.length === 0) {
                    emptyIndexes.push(index);
                }
            });
            for (let i = 0; i < emptyIndexes.length; i++) {
                months.splice(emptyIndexes[i], 1);
                schedule.splice(emptyIndexes[i], 1);
            }
            setMonths(months);

            setActiveDaysSchedule(schedule);
            setCalendarIsLoading(false);

        }).catch(err => {

        });
    }
    React.useEffect(() => {
        // isIran = store.get('user') ? store.get('user').timezone === 'Asia/Iran' : null;
        // isIran = country === 'Iran';
        const staffSlug = props.match.params.masterSlug;
        if (!props.location || !props.location.state || !props.location.state.staffPackageId) {
            props.history.replace('/');
            return;
        }
        const staffPackageId = props.location.state.staffPackageId;
        setCalendarIsLoading(true);
        axios.get(`api/v1.0/staffs/${staffSlug}/${staffPackageId}`).then(res => {
            setIsIranianCalendar(res.data.data.is_iran);
            setTermsStr(res.data.data.terms.value)
            setTypes(res.data.data.package.types)
            setSessionsType(res.data.data.package.types.length > 1 ? 'weekly' : 'biweekly');
            // let months = res.data.data.template;
            // let schedule = res.data.data.available;
            // let emptyIndexes = [];
            // res.data.data.template.map((month, index) => {
            //     if (!month.active_days || month.active_days.length === 0) {
            //         emptyIndexes.push(index);
            //     }
            // });
            // for (let i = 0; i < emptyIndexes.length; i++) {
            //     months.splice(emptyIndexes[i], 1);
            //     schedule.splice(emptyIndexes[i], 1);
            // }
            // setMonths(months);

            // setActiveDaysSchedule(schedule);
            setPack(res.data.data.package);
            console.log(res.data);
            // setCalendarIsLoading(false);
        }).catch(err => {

        });
        const user = store.get('user');
        const token = store.get('token');
        if (!user || !token) {
            store.remove('user');
            store.remove('token');
            props.history.replace('/signIn');
            return;
        }
        checkTimezone();
        getAndSetTimezones();
    }, []);

    const setClassTimes = () => {
        setClassTimesLoading(true);
        const data = {
            date: activeDayHours + ' ' + selectedHour,
            type: sessionsType,
            sessions: sessionsCount,
            is_iran: isIranianCalendar,
            timezone: userTimezone,
            staff_slug: props.match.params.masterSlug,
            package_id: pack.id
        };
        axios.post('/api/v1.0/dates', data).then(res => {
            setClassTimesLoading(false);
            // setClassTimesTable(res.data.map(time => time.replace("$", pack.is_iran ? "ساعت" : "time")));
            setClassTimesTable(res.data.map(time => ({
                ...time,
                date: time.date.replace("$", pack.is_iran ? "ساعت" : "time")
            })));
        }).then(err => {
            setClassTimesLoading(false);
        });
    };

    const handleSessionsCountChanged = sessionsCount => {
        setSessionsCount(sessionsCount);
    };
    const handleSessionsTypeChanged = sessionsType => {
        setSessionsType(sessionsType);
    };

    const handleUserTimeZoneChanged = timezone => {
        // TODO axios handleUserTimeZoneChanged
        const staffSlug = props.match.params.masterSlug;
        if (!props.location || !props.location.state || !props.location.state.staffPackageId) {
            props.history.replace('/');
            return;
        }
        const staffPackageId = props.location.state.staffPackageId;
        setCalendarIsLoading(true);
        axios.post(`api/v1.0/staffs/${staffSlug}/${staffPackageId}`,
            {
                timezone: timezone,
                sessionsCount: sessionsCount,
                sessionsType: sessionsType
            }
        ).then(res => {
            console.log(res.data);
            // console.log('reddddddddd',res.data.data)
            setTermsStr(res.data.data.terms.value)
            setTypes(res.data.data.package.types)
            setSessionsType(res.data.data.package.types.length > 1 ? 'weekly' : 'biweekly');
            // let months = res.data.data.template;
            // let schedule = res.data.data.available;
            setIsIranianCalendar(res.data.data.is_iran);
            // let emptyIndexes = [];
            // res.data.data.template.map((month, index) => {
            //     if (!month.active_days || month.active_days.length === 0) {
            //         emptyIndexes.push(index);
            //     }
            // });
            // for (let i = 0; i < emptyIndexes.length; i++) {
            //     months.splice(emptyIndexes[i], 1);
            //     schedule.splice(emptyIndexes[i], 1);
            // }
            // setMonths(months);
            // setActiveDaysSchedule(schedule);
            setPack(res.data.data.package);
            console.log(res.data);
            // setCalendarIsLoading(false);
        }).catch(err => {

        });
        setUserTimezone(timezone);
    };

    const packageTypesRender = () => {
        let types = []
        if (packageTypes.find(x => x.type == 'weekly')) {
            types.push({ value: 'weekly', displayValue: 'weekly' })
        }
        if (packageTypes.find(x => x.type == 'biweekly')) {
            types.push({ value: 'biweekly', displayValue: 'biweekly' })
        }

        return types

    }

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20} />
            <Header />
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#9BBA1F',
                width: '100%',
                textAlign: 'center'
            }}>
                <EmptySpace height={60} />

                <TimelineView
                    activeTab={activeTab}
                    tabs={[strings['Details'], strings['Time'], strings['Book']]}
                    onTabChange={(tab) => {
                        if (tab === strings['Book'] && !selectedHour) {
                            Toast(strings['First select date and time'], 'error');
                            return;
                        }
                        setClassTimes();
                        setActiveTab(tab);
                    }}
                />

                <EmptySpace height={20} />
                {
                    activeTab === strings['Details'] ? (
                        <div className={classes.f2}>

                            <div className={classes.packTitle} dir="ltr">
                                <TitledImage
                                    src={pack.staff ? axios.defaults.baseURL + pack.staff.user.avatar : null}
                                />
                                {
                                    pack.package ? (
                                        <div className={classes.packTitleText}>
                                            <b>
                                                {pack.duration}&nbsp;
                                                {strings['min']}&nbsp;
                                                {pack.package.name}&nbsp;
                                                {strings['by']}&nbsp;
                                                {pack.staff.user.name + ' ' + pack.staff.user.family}
                                            </b>
                                        </div>
                                    ) : <Loading isLoading color={'black'} />
                                }
                            </div>
                            <div className={classes.f2Wrapper}>

                                <div className={classes.leftSideWrapper}>
                                    <div className={classes.row}>
                                        {strings['Tuition Fee']}:&nbsp;
                                        {'$'}
                                        {pack.price ? sessionsCount * (pack.price) : '-'}&nbsp;
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row}>
                                        {
                                            isCouponPossible() ? `${strings['Code Discount']}:` : `${strings['Sessions Discount']}:`
                                        }
                                        &nbsp;
                                        {
                                            isCouponPossible() ? couponOff : getSessionsCountDiscount() * 100
                                        }
                                        %
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row}>
                                        {strings['Total Tuition']}:&nbsp;
                                        {'$'}

                                        {
                                            pack.price ? (isCouponPossible() ? getTotalPrice() * (100 - couponOff) / 100 : getTotalPrice() * (1 - getSessionsCountDiscount())) : '-'
                                        }
                                        &nbsp;
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row}>
                                        {strings['Type']}:&nbsp;
                                        {
                                            sessionsType
                                        }
                                        &nbsp;
                                    </div>
                                    <EmptySpace height={20} />
                                    {strings['Timezone']}
                                    <select className={classes.dropdown} value={userTimezone}
                                        onChange={e => handleUserTimeZoneChanged(e.target.value)}>
                                        {
                                            timezones.map(t => <option value={t.timezone}
                                                key={t.id}>{t.timezone}</option>)
                                        }
                                    </select>
                                    <EmptySpace height={20} />

                                </div>

                                <div className={classes.rightSideWrapper}>
                                    {/*<EmptySpace height={20}/>*/}
                                    {/*<div className={[classes.row, classes.rtl].join(' ')}>*/}
                                    {/*    {strings['Selected Date and Time']}:&nbsp;*/}
                                    {/*    <span>*/}
                                    {/*        <span dir={'ltr'}>*/}
                                    {/*            {getPersianWeekDayOf(selectedWeekDay)}*/}
                                    {/*        </span>&nbsp;{activeDayHours}*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    {strings['Type']}:
                                    {packageTypes ?
                                        <RadioButtons
                                            value={sessionsType}
                                            options={
                                                packageTypesRender()
                                            }


                                            onOptionClick={(value) => {
                                                handleSessionsTypeChanged(value)
                                            }}
                                        /> :
                                        <Loading isLoading color={'black'} />
                                    }

                                    <EmptySpace height={20} />
                                    {strings['Sessions Count']}:
                                    <RadioButtons
                                        value={sessionsCount}
                                        options={[
                                            { value: '1', displayValue: `1 ${strings['Session']}` },
                                            { value: '4', displayValue: `4 ${strings['Sessions']}` },
                                            {
                                                value: '8',
                                                displayValue:
                                                    sessionsType !== 'weekly' ? `8 ${strings['Sessions']}` : `8 ${strings['Sessions']} (5% ${strings['discount']}) `
                                            },
                                            {
                                                value: '12',
                                                displayValue:
                                                    sessionsType !== 'weekly' ? `12 ${strings['Sessions']}` : `12 ${strings['Sessions']} (10% ${strings['discount']}) `



                                            },

                                        ]}
                                        onOptionClick={(value) => {
                                            handleSessionsCountChanged(value)
                                        }}
                                    />
                                    {/*<select value={sessionsCount} className={classes.dropdown}*/}
                                    {/*        onChange={e => handleSessionsCountChanged(e.target.value)}>*/}
                                    {/*
                                        pack.type && (
                                            pack.type === 'single' ? (
                                                <option value={'1'}>1 جلسه</option>
                                            ) : (
                                                <>
                                                    <option value={'1'}>1 جلسه</option>
                                                    <option value={'2'}>2 جلسه</option>
                                                    <option value={'3'}>3 جلسه</option>
                                                    <option value={'4'}>4
                                                        جلسه&nbsp;{pack.type !== 'biweekly' ? '(5% تخفیف)' : null}</option>
                                                    <option value={'8'}>8 جلسه</option>
                                                    <option value={'12'}>12
                                                        جلسه&nbsp;{pack.type !== 'biweekly' ? '(10% تخفیف)' : null}</option>
                                                </>
                                            )
                                        )*/
                                    }
                                    {/*</select>*/}
                                    <EmptySpace height={20} />
                                    {sessionsType === 'weekly' &&
                                        <div className={[classes.row, classes.rtl].join(' ')}>
                                            {strings['Discount Code']}:
                                            &nbsp;
                                            <div className={classes.row}>
                                                <input type="text" className={classes.textInput} value={coupon}
                                                    style={{ borderRadius: '5px 0 0 5px' }}
                                                    onChange={e => setCoupon(e.target.value)} />
                                                <Button style={{ padding: '0 10px', borderRadius: '0 5px 5px 0' }}
                                                    onClick={handleRedeem}
                                                    aria-label="upload picture">
                                                    {strings['validate']}
                                                </Button>
                                            </div>
                                        </div>}

                                </div>

                            </div>
                            <TitleBar>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button style={{ backgroundColor: 'transparent' }}>
                                        <IconButton style={{ color: '#FFFFFF', fontSize: 20 }} title='Next'
                                            onClick={() => {
                                                props.history.push('../');
                                            }} color="primary"
                                            aria-label="upload picture" component="span">
                                            <NavigateBeforeIcon style={{ color: '#F2D3A3', width: 40, height: 40 }} />
                                            Previous
                                        </IconButton>
                                    </Button>
                                    {/*<Button style={{width: 40, height: 40, backgroundColor: 'transparent'}}>*/}
                                    {/*    <IconButton style={{color: '#FFFFFF'}} title='Previous' onClick={() => {*/}
                                    {/*        setActiveTab(strings['Time'])*/}
                                    {/*    }} color="primary"*/}
                                    {/*                aria-label="upload picture" component="span">*/}
                                    {/*        <NavigateNextIcon style={{color: '#F2D3A3', width: 40, height: 40}}/>*/}
                                    {/*    </IconButton>*/}
                                    {/*</Button>*/}
                                    <Button style={{ backgroundColor: 'transparent' }}>
                                        <IconButton style={{ color: '#FFFFFF', fontSize: 20 }} title='Next'
                                            onClick={() => {
                                                console.log('sfsfsfs')
                                                handleLoadTimes();
                                                setActiveTab(strings['Time'])
                                            }} color="primary"
                                            aria-label="upload picture" component="span">
                                            Next
                                            <NavigateNextIcon style={{ color: '#F2D3A3', width: 40, height: 40 }} />

                                        </IconButton>
                                    </Button>

                                </div>
                            </TitleBar>
                        </div>
                    ) : activeTab === strings['Time'] ? (
                        <div className={classes.f2}>

                            <div className={classes.f1Wrapper}>
                                <div className={classes.calendarWrapper}>
                                    <ClassDayChooser
                                        isLoading={calendarIsLoading}
                                        iranianCalendar={isIranianCalendar}
                                        selectedDay={activeDay}
                                        onSelectDay={daySelectedHandler}
                                        months={months.map(month => ({ ...month, max_day: Number(month.max_day) }))}
                                        activePageIndex={activePageIndex}
                                        onPrevButtonClick={calendarPrevButtonClickedHandler}
                                        onNextButtonClick={calendarNextButtonClickedHandler}
                                    />
                                </div>
                                <div className={classes.scheduleWrapper}>
                                    <div className={classes.hoursTitle}>{strings['Selected Day\'s Class Times']}</div>
                                    <EmptySpace height={40} />
                                    <AvailableHours
                                        perRow={4}
                                        items={activeDaysSchedule}
                                        active={activeDayHours}
                                        selectedHour={selectedHour}
                                        onItemSelect={(selected) => {
                                            setSelectedHour(selected);
                                        }}
                                    />
                                    <EmptySpace height={30} />
                                    <EmptySpace height={30} />
                                    {strings['Next sessions will be set weekly']}
                                </div>
                            </div>
                            <TitleBar>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button style={{ backgroundColor: 'transparent' }}>
                                        <IconButton style={{ fontSize: 20, color: '#FFFFFF' }} title='Next'
                                            onClick={() => {
                                                setActiveTab(strings['Details']);
                                            }} color="primary"
                                            aria-label="upload picture" component="span">
                                            {/*<NavigateBeforeIcon style={{color: '#F2D3A3', width: 40, height: 40}}/>*/}
                                            <NavigateBeforeIcon style={{ color: '#F2D3A3', width: 40, height: 40 }} />
                                            Previous

                                        </IconButton>
                                    </Button>
                                    {
                                        selectedHour && (
                                            <Button style={{ backgroundColor: 'transparent' }}>
                                                <IconButton style={{ fontSize: 20, color: '#FFFFFF' }} title='Next'
                                                    onClick={() => {
                                                        setClassTimes();
                                                        setActiveTab(strings['Book'])
                                                    }} color="primary"
                                                    aria-label="upload picture" component="span">
                                                    Next
                                                    <NavigateNextIcon style={{ color: '#F2D3A3', width: 40, height: 40 }} />
                                                    {/*<NavigateNextIcon*/}
                                                    {/*    style={{color: '#F2D3A3', width: 40, height: 40}}/>*/}
                                                </IconButton>
                                            </Button>
                                        )
                                    }

                                </div>
                            </TitleBar>
                        </div>
                    ) : (
                        <div className={classes.f2}>

                            <div className={classes.packTitle} dir="ltr">
                                <TitledImage
                                    src={pack.staff ? axios.defaults.baseURL + pack.staff.user.avatar : null}
                                />
                                {
                                    pack.package ? (
                                        <div className={classes.packTitleText}>
                                            <b>
                                                {pack.duration}&nbsp;
                                                {strings['min']}&nbsp;
                                                {pack.package.name}&nbsp;
                                                {strings['by']}&nbsp;
                                                {pack.staff.user.name + ' ' + pack.staff.user.family}
                                            </b>
                                        </div>
                                    ) : <Loading isLoading color={'black'} />
                                }
                            </div>
                            <div className={classes.f2Wrapper}>
                                <Button
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    className={classes.submitButton}
                                    hoverBgColor={"green"}
                                    onClick={handleReserve}
                                >
                                    {strings['Book']}
                                </Button>
                                <div className={classes.rightSideWrapper}>
                                    {
                                        classTimesLoading ? (
                                            <Loading isLoading color={'black'} width={200} height={100} />
                                        ) : (
                                            <table dir="rtl" className={classes.table}>
                                                <tr>
                                                    <td colSpan={2} style={{ textAlign: 'center' }}>
                                                        {strings['Class Times']}
                                                    </td>
                                                    {/* <td colSpan={1} style={{ textAlign: 'center' }}>
                                                        {strings['Available']}
                                                    </td> */}
                                                </tr>
                                                {
                                                    classTimes.map((session, index) => (
                                                        session.valid ? (
                                                            <tr key={Math.random()}>
                                                                <td>{strings['Session']} {index + 1}</td>
                                                                <td>{session.date}</td>
                                                                {/* <td>{strings['Yes']}</td> */}
                                                            </tr>
                                                        ) : (
                                                            <tr key={Math.random()}>
                                                                <td><span
                                                                    style={{ color: 'red' }}>{strings['Session']} {index + 1}</span>
                                                                </td>
                                                                <td><span style={{ color: 'red' }}>{session.date}</span>
                                                                </td>
                                                                {/* <td><span style={{ color: 'red' }}>{strings['No']}</span>
                                                                </td> */}
                                                            </tr>
                                                        )

                                                    ))
                                                }
                                            </table>
                                        )
                                    }
                                </div>
                                <div className={classes.leftSideWrapper}>
                                    <div className={classes.row}>
                                        {strings['Class Name']}:&nbsp;
                                        <b>{pack.package.name}</b>
                                    </div>
                                    {/*<div className={[classes.row, classes.rtl].join(' ')}>*/}
                                    {/*    زمان جلسه اول:&nbsp;*/}
                                    {/*    <span>*/}
                                    {/*    <span dir={'ltr'}>{getPersianWeekDayOf(selectedWeekDay)}</span>&nbsp;*/}
                                    {/*        {activeDayHours}*/}
                                    {/*        &nbsp;ساعت&nbsp;*/}
                                    {/*        {selectedHour}*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    <EmptySpace height={20} />
                                    <div className={[classes.row, classes.rtl].join(' ')}>
                                        {strings['Sessions Count']}
                                        &nbsp;
                                        <b>{sessionsCount}</b>
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row}>
                                        {strings['Discount']}:
                                        &nbsp;
                                        <b>
                                            {(((getTotalPrice() * (couponOff) / 100) > 0) || getTotalPrice() * getSessionsCountDiscount() > 0) && ('$')}

                                            {
                                                isCouponPossible() ? (
                                                    (getTotalPrice() * (couponOff) / 100) > 0 ? (getTotalPrice() * (couponOff) / 100) : '-'
                                                ) : (
                                                    getTotalPrice() * getSessionsCountDiscount() > 0 ? getTotalPrice() * getSessionsCountDiscount() : '-'
                                                )
                                            }
                                            &nbsp;
                                        </b>
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row}>
                                        {strings['Total Tuition']}:&nbsp;
                                        <b>
                                            {'$'}

                                            {
                                                pack.price ? (isCouponPossible() ? getTotalPrice() * (100 - couponOff) / 100 : getTotalPrice() * (1 - getSessionsCountDiscount())) : '-'
                                            }
                                            &nbsp;
                                        </b>
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row}>
                                        {strings['Type']}:&nbsp;
                                        <b>
                                            {
                                                sessionsType
                                            }
                                        </b>
                                    </div>
                                    <EmptySpace height={20} />
                                    <div className={classes.row} style={{ alignItems: 'center' }}>
                                        <FormControlLabel
                                            style={{ margin: 0, marginRight: -10 }}
                                            control={
                                                <Checkbox
                                                    onChange={showPolicies}
                                                    checked={accept}
                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                    name="checkedI"
                                                />
                                            }
                                            label={strings['I Accept the terms.']}
                                        />
                                    </div>
                                    {/*</FormGroup>*/}
                                </div>
                            </div>
                            <TitleBar>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button style={{ backgroundColor: 'transparent' }}>
                                        <IconButton style={{ color: '#FFFFFF', fontSize: 20 }} title='Next'
                                            onClick={() => {
                                                setActiveTab(strings['Time'])
                                            }} color="primary"
                                            aria-label="upload picture" component="span">
                                            <NavigateBeforeIcon style={{ color: '#F2D3A3', width: 40, height: 40 }} />
                                            Previous
                                        </IconButton>
                                    </Button>
                                </div>
                            </TitleBar>
                        </div>
                    )
                }
                <EmptySpace height={40} />
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <div dir="ltr" style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: strings['Terms'] }} />
                    </DialogTitle>
                    <DialogContent>

                        <DialogContentText id="alert-dialog-description">
                            <div dir="ltr" style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: termsStr }} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ padding: '0 10px' }} onClick={handleClose} color="primary">
                            {strings['I do not Accept']}
                        </Button>
                        <Button style={{ padding: '0 10px' }} onClick={handleAccept} color="primary" autoFocus>
                            {strings['I Accept']}
                        </Button>
                    </DialogActions>
                </Dialog>
                {/*<Footer/>*/}
                <EmptySpace height={40} />
            </div>
        </div>
    )
};

export default withRouter(ReservePage);

ReservePage.propTypes = {};

