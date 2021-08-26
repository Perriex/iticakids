import React from 'react';
import classes from './ForgotPasswordPage.module.scss';
import { Link, withRouter } from 'react-router-dom';
import Button from "../../components/Button/Button";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import Input from "../../components/Input/Input";
import axios from 'axios';
import store from 'store';
import { Toast } from '../../config/ToastConfig/Toast.config';
import { IconButton } from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import OtpInput from 'react-otp-input';
import CheckIcon from '@material-ui/icons/Check';
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import topWhite from "../../assets/effects/white-top-effect.svg";
import { strings } from "../../constants/js/strings";

const emailIsValid = (val) => {
    return val.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
};

const ForgotPasswordPage = props => {
    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [rePass, setRePass] = React.useState('');
    const [code, setCode] = React.useState('');
    const [success, setSuccess] = React.useState(true);
    const [rememberMe, setRememberMe] = React.useState(true);
    const [otp, setOtp] = React.useState('');
    const [state, setState] = React.useState(0);
    const token = store.get('token');
    const user = store.get('user');
    if (token && user) {
        props.history.replace('/');
    }



    const goAHead = () => setState(state + 1);
    const goBack = () => setState(state - 1);

    const [emailLoading, setEmailLoading] = React.useState(false);
    const [submitLoading, setSubmitLoading] = React.useState(false);
    const handleSendCode = () => {
        if (!emailIsValid(email)) {
            Toast(strings['Invalid Email'], 'error');
            return;
        }
        setEmailLoading(true);
        axios
            .post('api/auth/resetPassword', { email })
            .then(res => {
                console.log(res);
                setEmailLoading(false);
                goAHead();
            })
            .catch(err => {
                Toast(strings['An Error Occurred'], 'error');
                setEmailLoading(false);
                console.log(err);
            })
    };

    const handleReSendEmail = () => {
        if (!emailIsValid(email)) {
            Toast(strings['Invalid Email'], 'error');
            return;
        }
        setEmailLoading(true);
        axios
            .post('api/auth/resetPassword', { email })
            .then(res => {
                console.log(res);
                setEmailLoading(false);
            })
            .catch(err => {
                Toast(strings['An Error Occurred'], 'error');
                setEmailLoading(false);
                console.log(err);
            })
    };

    const handleSubmitCode = () => {
        goAHead();
    };

    const handleSubmitNewPassword = () => {
        if (pass.length < 8) {
            Toast(strings['Password length can not be less than 8 characters'], 'error');
            return;
        }
        if (pass !== rePass) {
            Toast(strings['Passwords are not same'], 'error');
            return;
        }
        setSubmitLoading(true);

        axios
            .post('api/auth/resetPassword/verify', {
                password: pass,
                code: code
            })
            .then(res => {
                setSuccess(true);
                setSubmitLoading(false);
                goAHead();
            })
            .catch(err => {
                setSuccess(false);
                setSubmitLoading(false);
                goAHead();
            })
    };


    React.useEffect(() => {
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
                <EmptySpace height={70} />

                <div className={classes.formWrapper}>
                    <EmptySpace height={20} />
                    {
                        state === 0 ? (
                            <>
                                <div className={classes.title}>
                                    {strings['Enter Your Email Address.']}
                                </div>
                                <EmptySpace height={10} />
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    title={strings['Email']}
                                    type="email"
                                />
                                <EmptySpace height={10} />
                                <EmptySpace height={10} />
                                <div style={{ direction: 'ltr', textAlign: 'left' }}>
                                    {strings['After pressing the "Send Code" button, you\'ll receive an email containing a code, and you have to enter that code in the next step.']}
                                </div>
                                <EmptySpace height={10} />
                                <Button disabled={emailLoading} isLoading={emailLoading} onClick={handleSendCode} style={{ height: 40 }}>{strings['Send Code']}</Button>
                            </>
                        ) : state === 1 ? (
                            <React.Fragment>
                                <div className={classes.title}>
                                    {strings['Enter the code']}
                                </div>
                                <EmptySpace height={20} />
                                <OtpInput
                                    value={otp}
                                    onChange={(otp) => {
                                        setOtp(otp)
                                        setCode(otp)
                                    }}
                                    numInputs={5}
                                    separator={<EmptySpace width={10} />}
                                    containerStyle={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                    inputStyle={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 5,
                                        border: '1px solid #FC7F0C',
                                        transition: 'all 0.2s'
                                    }}
                                    focusStyle={{
                                        border: '3px solid #FC7F0C'
                                    }}
                                />
                                <EmptySpace height={10} />
                                <EmptySpace height={10} />
                                <div style={{ direction: 'ltr', textAlign: 'left' }}>
                                    {strings['If you do not see any thing in you Inbox, checkout your spam emails before pressing the re-send button.']}
                                </div>
                                <EmptySpace height={30} />
                                <div className={classes.navigation}>
                                    <Button className={classes.navButton}>
                                        <IconButton style={{ color: '#FFFFFF' }} title='بعدی' onClick={goBack} color="primary"
                                            aria-label="upload picture" component="span">
                                            <NavigateBeforeIcon style={{ color: 'white', width: 40, height: 40 }} />
                                        </IconButton>
                                    </Button>
                                    <Button className={classes.navButton} disabled={emailLoading} isLoading={emailLoading}>
                                        <IconButton style={{ color: '#FFFFFF' }} onClick={handleReSendEmail}
                                            color="primary"
                                            aria-label="upload picture" component="span">
                                            <RefreshIcon style={{ color: 'white', width: 40, height: 40 }} />
                                        </IconButton>
                                    </Button>
                                    <Button className={classes.navButton}>
                                        <IconButton style={{ color: '#FFFFFF' }} onClick={handleSubmitCode}
                                            color="primary"
                                            aria-label="upload picture" component="span">
                                            <CheckIcon style={{ color: 'white', width: 40, height: 40 }} />
                                        </IconButton>
                                    </Button>
                                </div>
                                {/*<Button onClick={() => {}} style={{height: 40}}>ارسال کد یکبار مصرف</Button>*/}
                            </React.Fragment>
                        ) : state === 2 ? (
                            <>
                                <div className={classes.title}>
                                    {strings['Enter the new password']}
                                </div>
                                <EmptySpace height={10} />
                                <Input
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    title={strings['Repeat New Password']}
                                    type="password"
                                />
                                <EmptySpace height={10} />
                                <Input
                                    value={rePass}
                                    onChange={(e) => setRePass(e.target.value)}
                                    title={strings['New Password']}
                                    type="password"
                                />
                                <EmptySpace height={10} />
                                <EmptySpace height={10} />
                                <div style={{ direction: 'ltr', textAlign: 'left' }}>
                                    {strings['After this step, your password will change to this new password.']}
                                </div>
                                <EmptySpace height={30} />
                                <Button style={{ height: 40, padding: '0 10px', backgroundColor: 'green' }} onClick={handleSubmitNewPassword} disabled={submitLoading} isLoading={submitLoading}>
                                    {strings['Done']}
                                </Button>
                            </>
                        ) : state === 3 && (
                            <>
                                <div className={classes.title} style={{
                                    color: success === true ? 'green' : 'red',
                                    fontWeight: 'bold',
                                    fontSize: 25
                                }}>
                                    {
                                        success === true ? (
                                            strings['Your password was successfully changed to this new password. Now you can Login with your new password.']
                                        ) : (
                                            strings['Unfortunately a problem occurred. Please try later.']
                                        )
                                    }
                                </div>
                                <EmptySpace height={60} />
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {
                                        success === true ? (
                                            <Button style={{ height: 40, padding: '0 10px' }} onClick={() => props.history.replace('signIn')}>
                                                {strings['Go to login page']}
                                            </Button>
                                        ) : (
                                            <Button style={{ height: 40, padding: '0 10px' }} onClick={() => setState(0)}>
                                                {strings['Retry']}
                                            </Button>
                                        )
                                    }

                                </div>
                            </>
                        )
                    }
                </div>

                <EmptySpace height={70} />
            </div>
            <Footer />
        </div>
    )
};

export default withRouter(ForgotPasswordPage);

ForgotPasswordPage.propTypes = {};
