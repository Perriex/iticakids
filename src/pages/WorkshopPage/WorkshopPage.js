import React, { useState, useEffect } from 'react';
import classes from './WorkshopPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import Loading from "../../components/Loading/Loading";
import { Toast } from '../../config/ToastConfig/Toast.config.js';
import TitledImage from "../../components/TitledImage/TitledImage";
import Button from "../../components/Button/Button";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import bottomGreen from "../../assets/effects/green-bottom-effect.svg";
import greenPattern from "../../assets/public/green-pattern.png";
import { strings } from "../../constants/js/strings";
import store from "store";
import { Dialog, DialogActions, DialogTitle } from '@material-ui/core';

const PropVal = ({ prop, val }) => (
    <div className={classes.propVal}>
        <div className={classes.prop}>{prop}</div>
        :
        <div className={classes.val}>&nbsp;{val}</div>
    </div>
);
const WorkshopPage = props => {

    const [loading, setLoading] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);
    const [categories, setCategories] = useState([]);
    const backendBaseURL = axios.defaults.baseURL;
    const [displayData, setDisplayData] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [userTimezone, setUserTimezone] = useState();
    const [timezones, setTimezones] = useState([]);
    const [country, setCountry] = React.useState('');
    const [validCoupon, setValidCoupon] = useState(false);
    const [off, setOff] = useState(0);
    const [isRegistering, setIsRegistering] = useState(false);
    const isIran = () => country === 'Iran';
    const user = store.get('user');
    const token = store.get('token');

    const handleRegister = () => {
        if (!user || !token) {
            setOpenAuth(true)

        } else {
            // displayData && (window.location = displayData.registerUrl);
            setIsRegistering(true);
            axios.post(`api/v1.0/workshops/${displayData.slug}/reserve`, { timezone: userTimezone, coupon: validCoupon ? coupon : '' })
                .then(res => {
                    setIsRegistering(false);
                    if (res.data.data.paid === 1 && res.data.data.reserve_token === null) {
                        Toast('Order Completed successfully', 'success');
                        // props.history.redirect('/dashboard/myPackages');
                        document.location.href = axios.defaults.dashboard + "/myPackages";
                    } else {
                        const reserveToken = res.data.data.reserve_token;
                        // if (isIran()) {
                        //     document.location.href = `${axios.defaults.baseURL}/pay/workshop/zarrin?reserve_token=${reserveToken}`;
                        // } else {
                        //TODO Setting Pending to Non Iranian Users for Mashg'e Eshg
                        // document.location.href = axios.defaults.dashboard + '/mypackages';
                        document.location.href = `${axios.defaults.baseURL}/pay/workshop/paypal?reserve_token=${reserveToken}&site_id=7`;
                        // }
                    }
                })
                .catch(err => {
                    setIsRegistering(false);
                })
        }
    };

    const handleRedeem = () => {
        const data = {
            coupon: coupon,
            type: 'workshop',
            workshop_id: displayData.id
        };
        axios.post('/api/v1.0/staffs/checkCoupon', data)
            .then(res => {
                // console.log(res);
                if (!res.data.off_percent || res.data.off_percent === 0) {
                    Toast(strings['Coupon is not valid'], 'error');
                    setValidCoupon(false);
                } else {
                    // console.log(res.data.off_percent);
                    setOff(res.data.off_percent);
                    // setCouponOff(res.data.off_percent);
                    setValidCoupon(true);
                    Toast(strings['Done'], 'success');
                }
            })
        // TODO Redeem
    };

    const handleUserTimeZoneChanged = timezone => {
        setUserTimezone(timezone);
    }

    const getAndSetTimezones = () => {
        axios.get('api/timezones').then((res) => {
            setTimezones(res.data);
            // console.log(res.data);
            axios.get('api/ip_info').then((res) => {
                // console.log(res.data);
                setCountry(res.data.country_name);
                handleUserTimeZoneChanged(res.data.timezone);
            }).catch((err) => {
                Toast(strings['Could not get your Timezone! Please select it in "details" section.'], 'error');
            })
        })
    };

    useEffect(() => {
        setLoading(true);
        getAndSetTimezones();
        axios.get(`/api/v1.0/workshops/${props.match.params.workshopSlug}`).then(res => {
            setLoading(false);
            const d = res.data;
            setDisplayData({
                title: d.title,
                id: d.id,
                by: d.staff.user.name + ' ' + d.staff.user.family,
                img: backendBaseURL + d.staff.user.avatar,
                price: d.price,
                ir_price: d.ir_price,
                sessions: d.sessions,
                capacity: d.capacity,
                body: d.body,
                time: d.start_at.split(' ')[1],
                date: d.start_at.split(' ')[0],
                level: JSON.parse(d.json).level,
                registerUrl: d.register_url,
                slug: d.slug
            })
        }).catch(err => {
            console.log(err);
            Toast('An error occurred when receiving data!', 'error');
        });
    }, []);

    return (
        <div className={classes.wrapper}>
            <Dialog
                open={openAuth}
                onClose={() => setOpenAuth(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    className: classes.dialog,
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Please login/register before reserve online class/workshop
                </DialogTitle>
                {/* <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        <div dir="ltr" style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: termsStr }} />
                    </DialogContentText>
                </DialogContent> */}
                <DialogActions>
                    <Button style={{ padding: '0 10px' , width:80 }} onClick={()=>{window.location='/signUp'}} color="primary">
                        register
                    </Button>
                    <Button style={{ padding: '0 10px' , width:80 }} onClick={()=>{window.location = '/signIn'}} color="primary" autoFocus>
                        login
                    </Button>
                </DialogActions>
            </Dialog>


            <EmptySpace height={20} />
            <Header />
            <EmptySpace height={30} />
            {/*<h2 className={classes.title}>ورکشاپ ها</h2>*/}
            <TransitionEffect stickTo={'bottom'} image={bottomGreen} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#80BA5E',
                width: '100%',
                // textAlign: 'center',
                backgroundImage: `url(${greenPattern})`
            }}>
                <EmptySpace height={30} />
                <div className={classes.workshopWrapper}>
                    <div className={classes.registerCard}>
                        <TitledImage
                            src={displayData?.img}
                            noBorder
                            title={`by: ${displayData?.by}`}
                            style={{ width: 320, height: 280, margin: 0 }}
                        />
                        <div className={classes.priceAndSessions}>
                            <div
                                className={classes.rowItem}>{strings['Price']}<br /><b>{displayData ?
                                    `${"$" + (displayData.price - (displayData.price * (off / 100)))}` :
                                    '-'}</b>
                            </div>
                            <div
                                className={classes.rowItem}>{strings['Capacity']}<br /><b>{displayData ? displayData.capacity : '-'}</b>
                            </div>
                        </div>
                        <div>
                            {
                                !displayData ? (
                                    <Loading isLoading color={'black'} width={'100%'} height={100} />
                                ) : (
                                    <table dir="rtl" className={classes.table}>
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: 'center' }}>
                                                {strings['Class Times']}
                                            </td>
                                        </tr>
                                        {
                                            displayData.sessions.map((session, index) => (
                                                <tr key={Math.random()}>
                                                    <td dir={"rtl"}>{session.start_date.split(" ")[1].slice(0, -3)}</td>
                                                    <td dir={"rtl"}>{session.start_date.split(" ")[0]}</td>
                                                    <td>{strings['Session']} {index + 1}</td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                )
                            }
                        </div>
                        <div className={[classes.whiteCard, classes.center].join(' ')}>
                            <div className={[classes.row].join(' ')}>
                                {strings['Coupon']}:
                                &nbsp;
                                <div className={classes.row}>
                                    <input type="text" className={classes.textInput} value={coupon}
                                        style={{ borderRadius: '10px 0 0 10px' }}
                                        onChange={e => setCoupon(e.target.value)} />
                                    <Button style={{ padding: '0 10px', borderRadius: '0 10px 10px 0' }}
                                        onClick={handleRedeem}
                                        aria-label="upload picture">
                                        {strings['Redeem']}
                                    </Button>
                                </div>
                            </div>
                            <div className={[classes.whiteCard, classes.center].join(' ')}>
                                <div className={[classes.row].join(' ')}>
                                    {strings['Timezone']}:
                                    <select className={classes.dropdown} value={userTimezone}
                                        onChange={e => handleUserTimeZoneChanged(e.target.value)}>
                                        {
                                            timezones.map(t => <option value={t.timezone} key={t.id}>{t.timezone}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <Button disabled={isRegistering} isLoading={isRegistering} onClick={handleRegister} style={{ borderRadius: 10, height: 40 }}>Register</Button>
                    </div>
                    {
                        <div className={classes.workshopDetails}>
                            <Loading isLoading={loading} height={200} width={200} />
                            <h2 className={classes.title}>{displayData?.title}</h2>
                            <PropVal prop={'by'} val={displayData?.by} />
                            {/* <PropVal prop={'time'} val={displayData?.time} />
                            <PropVal prop={'date'} val={displayData?.date} /> */}
                            <PropVal prop={'level'} val={displayData?.level} />
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: displayData?.body }} />
                            <br />
                            <p>
                            After registration, you will receive an email providing the information to join your class. In case you did not get the email after the payment, please contact us at kids@rhythmitica.com.
                            </p>
                        </div>
                    }
                </div>
                <EmptySpace height={60} />
            </div>
            <Footer />
        </div>
    )
};

export default WorkshopPage;

WorkshopPage.propTypes = {};
