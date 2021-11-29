import React from 'react';
import classes from './MessagePage.module.scss';
import EmptySpace from "../../components/EmptySpace/EmptySpace";
import Footer from "../../containers/Footer/Footer";
import Header from "../../containers/Header/Header";
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MessagePage = props => {

    const [type, setType] = React.useState('warning');
    const [message, setMessage] = React.useState('');

    const messageColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ffb300' : '#000000';
    let query = useQuery();

    React.useEffect(() => {
        setMessage(query.get('msgEn') || query.get('message'));
        setType(query.get('type'));
        console.log(props.match);
        // if(query.get('variant')=='workshop'){
        //     window.location.replace('/dashboard/myworkshops')
        // }
        // if(query.get('variant')=='booking'){
        //     window.location.replace('dashboard/mypackages')
        // }
    }, []);


    return (
        <div className={classes.wrapper}>
            <EmptySpace height={20} />
            <Header />
            <EmptySpace height={40} />

            {/*<ReadMoreArticle body={body} photo={items[0].photo}/>*/}

            <EmptySpace height={20} />

            <div className={classes.messageWrapper}>
                <span>
                    <h2 style={{ color: messageColor }}>
                        {message}
                    </h2>
                </span>
            </div>

            <EmptySpace height={40} />
            <Footer />
        </div>
    )
};

export default MessagePage;

MessagePage.propTypes = {};
