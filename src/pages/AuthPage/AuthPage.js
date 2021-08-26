import React from 'react';
import classes from './AuthPage.module.scss';
import { Link, withRouter } from 'react-router-dom';
import Button from "../../components/Button/Button";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import Input from "../../components/Input/Input";
import axios from 'axios';
import store from 'store';
import { Toast } from '../../config/ToastConfig/Toast.config';
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Select, MenuItem } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import topWhite from "../../assets/effects/white-top-effect.svg";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import { strings } from "../../constants/js/strings";
import countries from './countries.json'
const encw = (str, depth) => depth === 5 ? str : encw(btoa(str.split('').reverse().join('')).replace(/=/g, '?'), depth + 1);
const decw = (str, depth) => depth === 5 ? str : decw(atob(str.replace(/\?/g, '=')).split('').reverse().join(''), depth + 1);
const enc = str => encw(str, 0);
const dec = str => decw(str, 0);

const emailIsValid = (val) => {
    return val.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
};


const AuthPage = props => {
    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [rePass, setRePass] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [city, setCity] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const token = store.get('token');
    const user = store.get('user');
    if (token && user) {
        props.history.replace('/');
    }

    const checkValidity = (callback) => {
        if (!emailIsValid(email)) {
            Toast(strings['Invalid Email!'], 'error');
            return;
        }
        if (pass.trim().length < 6) {
            Toast(strings['Password must be at least 8 characters'], 'error');
            return;
        }
        if (props.type === 'signup') {
            if (firstName.trim().length < 3 || lastName.trim().length < 3) {
                Toast(strings['Name and Family must have at list 3 characters'], 'error');
                return;
            }
            if (pass !== rePass) {
                Toast(strings['Passwords do not match'], 'error');
            }
        }
        callback();
    };

    const handleFormSubmit = () => {
        checkValidity(() => {
            setIsLoading(true);
            let data = {};
            data.email = email.trim();
            data.password = pass.trim();
            if (rememberMe)
                store.set('authData', enc(JSON.stringify({ email: data.email, password: data.password })));
            else store.remove('authData');

            if (props.type === 'signup') {
                data.name = firstName.trim();
                data.family = lastName.trim();
                data.phone_number = phone.trim();
                data.country = city.trim();
                console.log(data);
                axios.post('api/auth/register', data).then(res => {
                    console.log(res.data);
                    console.log(data);
                    // Toast('حساب کاربری شما با موفقیت ایجاد شد. برای فعال سازی حساب کاربری خود ایمیل خود را چک کنید. در صورت عدم مشاهده ایمیل، صندوق spam را هم چک کنید.', 'success');
                    Toast(strings['Your account was created successfully. To activate your account, checkout your Email Inbox. If you do not see anything, then checkout your spam messages.'], 'success');
                    props.history.replace('/signIn');
                    setIsLoading(false);
                }).catch(err => {
                    Toast(strings['This Email Exists!'], 'error')
                    setIsLoading(false);
                });
            } else {
                axios.post('api/auth/login', data).then(res => {
                    store.set('token', `Bearer ${res.data.data.token}`);
                    store.set('user', res.data.data.user);
                    setIsLoading(false);
                    window.location.reload();
                }).catch(err => {
                    Toast(strings['Invalid Email or Password!'], 'error');
                    setIsLoading(false);
                });
            }
        });
    };

    React.useEffect(() => {
        let authData = store.get('authData');
        if (authData) {
            try {
                let ad = JSON.parse(dec(authData));
                setEmail(ad.email);
                setPass(ad.password);
            } catch (error) {
                store.remove('authData');
            }
        }
    }, []);

    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20} />
            <Header />
            <TransitionEffect stickTo={'top'} image={topWhite} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#FF7200',
                width: '100%',
                textAlign: 'center'
            }}>
                <EmptySpace height={100} />

                <div className={classes.formWrapper}>
                    <EmptySpace height={20} />
                    <div className={classes.title}>
                        {strings['Fill in the whole fields.']}
                    </div>
                    {
                        props.type === 'signup' && (
                            <>
                                <EmptySpace height={20} />
                                <div className={classes.nameAndLastNameWrapper} dir="ltr">
                                    <div className={classes.flex1}>
                                        <Input
                                            rtl={false}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            title={strings['Name']}
                                            type="text"
                                        />
                                    </div>
                                    <EmptySpace width={10} height={10} />
                                    <div className={classes.flex1}>
                                        <Input
                                            rtl={false}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            title={strings['Family']}
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <EmptySpace height={10} />
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    title={"phone"}
                                    type="tel"
                                />
                                <EmptySpace height={10} />
                                {/* <Input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    title={"country"}
                                    type="text"
                                /> */}
                                <div style={props.rtl ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left', direction: 'ltr' }}>{`Country`}</div>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={city}
                                    onChange={(e) => { setCity(e.target.value) }}
                                    style={{ width: '100%', border: '2px solid #FC7F0C', borderRadius: 5 }}
                                >
                                    <MenuItem value="" disabled>
                                        select country
                                    </MenuItem>
                                    {
                                        countries.map((c) => (
                                            <MenuItem value={c.name}>{c.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </>
                        )
                    }

                    {/*--------------------------------------------------------------------*/}
                    <EmptySpace height={10} />
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        title={strings['Email']}
                        type="email"
                    />
                    <EmptySpace height={10} />
                    <Input
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        title={strings['Password']}
                        type="password"
                    />
                    {/*--------------------------------------------------------------------*/}
                    {
                        props.type === 'signup' ? (
                            <>
                                <EmptySpace height={10} />
                                <Input
                                    value={rePass}
                                    onChange={e => setRePass(e.target.value)}
                                    title={strings['Repeat Password']}
                                    type="password"
                                />
                                <EmptySpace height={20} />
                                <Button disabled={isLoading} isLoading={isLoading} onClick={handleFormSubmit}
                                    style={{ height: 40 }}>{strings['Sign Up']}</Button>
                                <div className={classes.changeTypeWrapper}>
                                    <Link to={'/signIn'}>
                                        <div className={classes.changeType}
                                            style={{ cursor: 'pointer', color: '#0000FF', textDecoration: 'underline' }}>
                                            {strings['Already have an account?']}
                                        </div>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <EmptySpace height={10} />
                                <div style={{
                                    textAlign: 'left',
                                    color: 'blue',
                                    height: 20,
                                    transform: 'translateY(-10px)',
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    props.history.push('/forgetPassword')
                                }}>
                                    {strings['I Forgot My Password']}
                                </div>
                                <div style={{ textAlign: 'left', marginLeft: -10 }}>
                                    <Checkbox
                                        id="remember-me"
                                        onChange={() => {
                                            setRememberMe(!rememberMe)
                                        }}
                                        checked={rememberMe}
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" style={{ color: 'green' }} />}
                                        checkedIcon={<CheckBoxIcon fontSize="small" style={{ color: 'green' }} />}
                                        name="checkedI"
                                    />
                                    <label htmlFor="remember-me" style={{ userSelect: 'none' }}>{strings['Remember Me']}</label>

                                </div>
                                <EmptySpace height={10} />
                                <Button disabled={isLoading} isLoading={isLoading} onClick={handleFormSubmit}
                                    style={{ height: 40 }}>{strings['Login']}</Button>
                                <div className={classes.changeTypeWrapper}>
                                    <Link to={'/signUp'}>
                                        <div className={classes.changeType}
                                            style={{ cursor: 'pointer', color: '#0000FF', textDecoration: 'underline' }}>
                                            {strings['Do not have an account?']}
                                        </div>
                                    </Link>
                                </div>
                            </>
                        )
                    }
                    <EmptySpace height={20} />
                </div>

                <EmptySpace height={100} />
            </div>
            <Footer />
        </div>
    )
};

export default withRouter(AuthPage);

AuthPage.propTypes = {};
