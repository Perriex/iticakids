import React, { useState } from 'react';
import useStyles from './style.js'
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { withStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';
import whatsappPng from '../../assets/whatsapp.png';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { useHistory } from 'react-router';

const FloatWhatsapp = () => {
    const classes = useStyles()
    const [opened, setOpened] = useState(false)
    let history = useHistory();
    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: opened ? 0 : 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
            display: 'flex',
            opacity: opened ? 0 : 1,
            alignItems: 'center',
            transition: 'all 250ms ease',
            height: opened ? 0 : 30,
            padding: '10px 15px',
            justifyContent: 'center',
            '& .MuiTooltip-popperArrow , & .MuiTooltip-arrow:before': {
                backgroundColor: '#f5f5f9'
            }
        },
    }))(Tooltip);
    const handleClickFloat = () => {
        if (opened) {
            window.open(
                'https://wa.me/message/MLP6XICPPX6TC1'
                , '_blank', 'noopener,noreferrer')
        } else {
            setOpened(true)
        }
    }
    return (
        <>
            <HtmlTooltip
                title="Need help?"
                arrow
                placement="right"
            >
                <div className={classes.floatBtn} onClick={() => handleClickFloat()}>
                    <WhatsAppIcon />
                </div>
            </HtmlTooltip>
            <div className={clsx(classes.whatsappModal, opened && classes.openWhatsapp)}>

                <div className={classes.header}>
                    <div className={classes.closeBtn} onClick={() => setOpened(false)}>
                        <CloseIcon />
                    </div>
                    <img src="/static/media/kids-logo.a138f7d9.png" />

                </div>

                <div className={classes.body}>
                    <div className={classes.bubbleChat}>
                        <p>Hello  👋</p>
                        <p>How can we help you?</p>
                    </div>
                    <div style={{opacity:opened?1:0}} className={clsx(classes.floatBtn, opened && classes.openedFloat)} onClick={() => handleClickFloat()}>
                        <WhatsAppIcon />
                        <p>Chat in WhatsApp</p>
                    </div>
                </div>
            </div>

        </>

    )
}

export default FloatWhatsapp