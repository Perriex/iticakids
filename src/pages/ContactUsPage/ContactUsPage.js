import React from 'react';
import classes from './ContactUsPage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import axios from 'axios';
import { Container, Col, Row } from 'react-bootstrap';
import Input from "../../components/Input/Input";
import TextArea from "../../components/TextArea/TextArea";
import Button from '../../components/Button/Button';
import email from '../../assets/ContactUs/email.svg';
import { Toast } from "../../config/ToastConfig/Toast.config";
import topWhite from "../../assets/effects/white-top-effect.svg";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import { strings } from "../../constants/js/strings";
import { Link } from "react-router-dom";
import home from "../../assets/general/footerIcons/home-2.svg";
import phone from "../../assets/general/footerIcons/phone.svg";
import mail from "../../assets/general/footerIcons/mail.svg";
import website from "../../assets/general/footerIcons/website.svg";
import store from "store";

const ContactUsPage = props => {

    const [loading, setLoading] = React.useState(false);
    const backendBaseURL = axios.defaults.baseURL;
    const [data, setData] = React.useState({});

    const handleInput = e => {
        let newData = { ...data };
        newData[e.target.name] = e.target.value;
        setData(newData);
    };

    const handleSubmit = e => {
        if (data.name && data.lastName && data.email && data.subject && data.message && data.name.trim() && data.lastName.trim() && data.email.trim() && data.subject.trim() && data.message.trim()) {
            // TODO Submit

            axios.post('/api/contact_us', {
                ...data
            }).then(res => {
                console.log(res.data);
                Toast('Your message successfully sent!', 'success');

            }).catch(err => {
                Toast(strings['An error occurred when receiving data!'], 'error');
            });

        } else {
            Toast(strings['Fill in the whole fields.'], 'error');
        }
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
                backgroundColor: '#FFC000',
                width: '100%',
                textAlign: 'center'
            }}>
                <EmptySpace height={80} />
                <Container>
                    <Row>
                        <Col lg={6}>
                            <h5 style={{
                                width: '100%',
                                direction: 'ltr',
                                textAlign: 'left'
                            }}>{strings['Contact Us']}</h5>
                            <EmptySpace height={20} />
                            <Row dir={'rtl'}>
                                <Col lg={6} md={12}>
                                    <Input
                                        rtl={false}
                                        className={classes.nameInput}
                                        type={'text'}
                                        placeholder={strings['Name']}
                                        onChange={handleInput}
                                        name={'name'}
                                    />
                                </Col>
                                <Col lg={6} md={12}>
                                    <Input
                                        rtl={false}
                                        type={'text'}
                                        placeholder={strings['Family']}
                                        onChange={handleInput}
                                        name={'lastName'}
                                    />
                                </Col>
                            </Row>
                            <EmptySpace height={10} />
                            <Input
                                rtl={false}
                                type={'text'}
                                placeholder={strings['Email']}
                                onChange={handleInput}
                                name={'email'}
                            />
                            <EmptySpace height={10} />
                            <Input
                                rtl={false}
                                type={'text'}
                                placeholder={strings['Subject']}
                                onChange={handleInput}
                                name={'subject'}
                            />
                            <EmptySpace height={10} />
                            <TextArea
                                style={{ minHeight: 100 }}
                                rtl={false}
                                placeholder={strings['Your Message']}
                                onChange={handleInput}
                                name={'message'}
                            />
                            <Button
                                style={{
                                    marginTop: 10,
                                    height: 40
                                }}
                                onClick={handleSubmit}
                            >
                                {strings['Send Message']}
                            </Button>
                        </Col>
                        <Col lg={6} className={classes.details}>
                            <h5 style={{ width: '100%', direction: 'ltr', textAlign: 'left' }}>{strings['Contact Details']}</h5>
                            <EmptySpace height={20} />
                            <div className={classes.body} style={{ fontSize: 15, }}>
                                <Link to={'#'}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: 40
                                    }}>
                                        <img src={home} style={{ width: 25 }} />
                                        <b style={{ paddingLeft: 5 }}>{strings.variables.home}</b>
                                    </div>
                                </Link>
                                <Link to={'#'}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: 40
                                    }}>
                                        <img src={phone} style={{ width: 25 }} />
                                        <b style={{ paddingLeft: 5 }}>{strings.variables.phone}</b>
                                    </div>
                                </Link>
                                <Link to={'#'}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: 40
                                    }}>
                                        <img src={mail} style={{ width: 25 }} />
                                        <b style={{ paddingLeft: 5 }}>{strings.variables.email}</b>
                                    </div>
                                </Link>
                                <Link to={'#'}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: 40
                                    }}>
                                        <img src={website} style={{ width: 25 }} />
                                        <b style={{ paddingLeft: 5 }}>{strings.variables.website}</b>
                                    </div>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/*<div className={classes.body}>*/}

                {/*</div>*/}
                <EmptySpace height={80} />
            </div>
            <Footer />
        </div>
    )
};

export default ContactUsPage;

ContactUsPage.propTypes = {};
