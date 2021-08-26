import React from 'react';
import * as PropTypes from 'prop-types';
import classes from './Footer.module.scss';
import TinyArticle from "../../components/TinyArticle/TinyArticle";
import BlackWrapper from "../../components/BlackWrapper/BlackWrapper";
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Button from '../../components/Button/Button';
import {Divider} from '@material-ui/core';

import rhythmiticaLogo from '../../assets/general/rhythmitica-logo.png';
import {Link} from 'react-router-dom';
import bottomWhite from "../../assets/effects/white-bottom-effect.svg";
import TransitionEffect from "../../components/TransitionEffect/TransitionEffect";
import {strings} from "../../constants/js/strings";

import website from '../../assets/general/footerIcons/website.svg';
import mail from '../../assets/general/footerIcons/mail.svg';
import phone from '../../assets/general/footerIcons/phone.svg';
import home from '../../assets/general/footerIcons/home.svg';

import youtube from '../../assets/general/socialMedia/youtube.svg';
import facebook from '../../assets/general/socialMedia/facebook.svg';
import twitter from '../../assets/general/socialMedia/twitter.svg';
import instagram from '../../assets/general/socialMedia/instagram.svg';
import linkedin from '../../assets/general/socialMedia/linkedin.svg';

import whitePattern from '../../assets/public/white-pattern.png';

const Footer = props => {
    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundImage: `url(${whitePattern})`}}>
            <TransitionEffect stickTo={'bottom'} image={bottomWhite}/>
            <div className={classes.wrapper}>
                <div className={classes.bodyWrapper}>
                    <div className={classes.right}>
                        <div className={classes.title}>
                        <a target='_blank' href={'https://www.rhythmitica.com'}><img src={rhythmiticaLogo}/></a>  
                        </div>
                        <p className={classes.body}>
                            {strings.variables.footerAboutText}
                        </p>
                    </div>
                    <div className={classes.leftSide}>
                        <div className={classes.center}>
                            <div className={classes.title} style={{color: '#FFC000'}}>Online Group Classes for Kids</div>
                            <div className={classes.body}>
                                <Link to={'#'}>
                                    <div><b>Kids music 1-3 years</b></div>
                                    <div>by Arghavan</div>
                                </Link>
                                <Link to={'#'}>
                                    <div><b>Kids music 3-5 years</b></div>
                                    <div>by Shahrzad</div>
                                </Link>
                                <Link to={'#'}>
                                    <div><b>Kids music 5-7 years</b></div>
                                    <div>by Mastaneh</div>
                                </Link>
                                <Link to={'#'}>
                                    <div><b>Kids music 7-12 years</b></div>
                                    <div>by Nastaran</div>
                                </Link>
                                <Link to={'#'}>
                                    <div><b>Choir and Singing Class</b></div>
                                    <div>by </div>
                                </Link>
                            </div>
                        </div>
                        <div className={classes.left}>
                            {/*<div className={classes.title}></div>*/}
                            <div className={classes.body} style={{fontSize: 15,}}>
                                <Link to={'#'}>
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: 40}}>
                                        <img src={home} style={{width: 25}}/>
                                        <b style={{paddingLeft: 5}}>{strings.variables.home}</b>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: 40}}>
                                        <img src={phone} style={{width: 25}}/>
                                        <b style={{paddingLeft: 5}}>{strings.variables.phone}</b>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: 40}}>
                                        <img src={mail} style={{width: 25}}/>
                                        <b style={{paddingLeft: 5}}>{strings.variables.email}</b>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: 40}}>
                                        <img src={website} style={{width: 25}}/>
                                        <b style={{paddingLeft: 5}}>{strings.variables.website}</b>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <EmptySpace height={50}/>
                <Divider style={{margin: '10px 0'}} />
                <div className={classes.copyright}>
                    <div>
                        © 2021 ITICA. All Rights Reserved.
                    </div>
                    <div>
                        
                        
                         <a target='_blank' href={'https://www.youtube.com/channel/UC4mlJHQiw5JmZOs-54WwBRQ'}><img className={classes.socialMediaIcon} src={youtube} /></a> 
                       
                         <a target='_blank' href={'https://www.instagram.com/rhythmitica.kids'}><img className={classes.socialMediaIcon} src={instagram}  /></a>
                    </div>
                </div>
                <EmptySpace height={20}/>
                <EmptySpace height={20}/>
            </div>
        </div>
    )
};

export default Footer;

Footer.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string
        })
    ),
};
