import React, { Component } from 'react';
import { Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import Routes from './Routes';
import Validator from "./Validator";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import axios from "axios";
import { Toast } from "./config/ToastConfig/Toast.config";
import { connect } from 'react-redux';
import store from "store";
import { strings } from "./constants/js/strings";
import WebsiteRoutes from "./WebsiteRoutes/WebsiteRoutes";
import config from "./website.config";

const browserHistory = createBrowserHistory();

class App extends Component {
    state = {
        isIran: false
    };

    constructor(props) {
        super(props);
        this.state = { isDashboard: this.isDashboard() }
    }

    componentDidMount() {
        this.unlisten = browserHistory.listen(location => {
            Validator.reset();
            if (!this.isProfileOk()) {
                Toast(strings['Please Complete your profile.'], 'warning');
                browserHistory.push(window.dashboard_url + "/account");
            }
            this.setState({ ...this.state, isDashboard: this.isDashboard() })
        });

        if (!this.isProfileOk()) {
            Toast(strings['Please Complete your profile.'], 'warning');
            browserHistory.push(window.dashboard_url + "/account");
        }

        axios.get('api/ip_info').then((res) => {
            this.props.setIsIran(res.data.country_name === 'Iran')
        }).catch((err) => {
            Toast(strings['Could not get your Timezone! Please select it in "details" section.'], 'error');
        })

        if (!this.state.isDashboard) {
            axios.defaults.headers.common['site'] = config.site;
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }

    isDashboard() {
        return window.location.href.includes(window.dashboard_url);
    }

    isProfileOk() {
        if (store.get("user")) {
            if (!window.location.href.includes("account")) {
                return store.get("user").name;
            }
        }
        return true;
    }

    render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <ThemeProvider theme={theme}>
                    <Router history={browserHistory}>
                        <Routes>
                            <WebsiteRoutes />
                        </Routes>
                        <ToastContainer rtl style={{ zIndex: '100000000000000000000000000000000000000' }} />
                    </Router>
                </ThemeProvider>
            </MuiPickersUtilsProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        isIran: state.isIran
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setIsIran: (val) => dispatch({ type: 'SET_IS_IRAN', value: val })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

