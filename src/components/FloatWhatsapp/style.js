import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({

    floatBtn: {
        position: 'fixed',
        width: 60,
        height: 60,
        bottom: 45,
        zIndex: 990,

        left: 40,
        backgroundColor: '#24d366',
        borderRadius: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0 ease',
        '& svg': {
            color: '#fff',
            fontSize: 36
        },
        '&:hover': {
            backgroundColor: '#0c7a36',
        },
        '& p': {
            color: "#fff",
            marginLeft: 10,
            marginBottom: 0,
            opacity: 0,
            transition: 'all 0ms ease',

        }
    },
    openedFloat: {
        width: 200,
        transition: 'all 250ms ease',
        '& p': {
            opacity: 1,
            transition: 'all 800ms ease',

        }

    },
    whatsappModal: {
        width: 400,
        height: 272,
        borderRadius: 32,
        overflow: 'hidden',
        position: 'fixed',
        opacity: '0',
        pointerEvents: 'none',
        bottom: 25,
        left: 20,
        backgroundColor: '#f5f5f9',
        zIndex: 999,
        transition: 'all 250ms ease',
        boxShadow: '0 2px 6px 0 rgb(0 0 0 / 50%)',


    },
    openWhatsapp: {
        opacity: '1',
        pointerEvents: 'auto',
    },
    header: {
        width: '100%',
        height: 70,
        padding: '0 50px 0 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#24d366',
        '& img': {
            height: 40
        }
    },
    closeBtn: {
        width: 34,
        height: 34,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 34,
        cursor: 'pointer',
        '& svg': {
            color: '#fff'
        }
    },
    body: {
        padding: '20px 0 70px 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',

    },
    bubbleChat: {
        width: '348px',
        height: 86,
        borderRadius: 32,
        boxShadow: '0 2px 6px 0 rgb(0 0 0 / 50%)',
        position: 'relative',
        padding:'10px 20px'
       
    }
}));
