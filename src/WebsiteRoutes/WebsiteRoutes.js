import { BrowserRouter, Route, Switch } from "react-router-dom";
import OnlineClassesPage from "../pages/OnlineClassesPage/OnlineClassesPage";
import ContactUsPage from "../pages/ContactUsPage/ContactUsPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import CategoriesPage from "../pages/CategoriesPage/CategoriesPage";
import WorkshopsPage from "../pages/WorkshopsPage/WorkshopsPage";
import WorkshopPage from "../pages/WorkshopPage/WorkshopPage";
import MessagePage from "../pages/MessagePage/MessagePage";
import ReservePage from "../pages/ReservePage/ReservePage";
import MastersPage from "../pages/MastersPage/MastersPage";
import MasterPage from "../pages/MasterPage/MasterPage";
import OnlineClassPage from "../pages/OnlineClassPage/OnlineClassPage";
import HomePage from "../pages/HomePage/HomePage";
import AuthPage from "../pages/AuthPage/AuthPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import Blog from "../pages/Blog/Blog";
import BlogPostPage from "../pages/BlogPostPage/BlogPostPage";
import React from "react";
import { connect } from "react-redux";
import FloatWhatsapp from "../components/FloatWhatsapp/FloatWhatsapp";
import GroupClassesPage from "../pages/GroupClassesPage/GroupClassesPage";
const styles = {
    app: {
        fontSize: 20,
        minHeight: '100%'
    }
};
const WebsiteRoutes = props => {
    return (
        <div key={Math.random()} style={{ backgroundColor: 'white', ...styles }}>
            <Route exact path={'/Categories/:categorySlug'} render={(props) => {
                return <OnlineClassesPage key={'OnlineClassesPage'} {...props} />
            }} />
            <Route exact path={'/ContactUs'} render={() => {
                return <ContactUsPage key={'ContactUs'} />
            }} />
            <Route exact path={'/About'} render={() => {
                return <AboutPage key={'AboutPage'} />
            }} />
            <Route exact path={'/Categories'} render={() => {
                return <CategoriesPage key={'CategoriesPage'} />
            }} />
            <Route exact path={'/Workshops'} render={() => {
                return <WorkshopsPage key={'WorkshopsPage'} />
            }} />
             <Route exact path={'/groupClasses'} render={() => {
                return <GroupClassesPage key={'groupClassesPage'} />
            }} />
            <Route exact path={'/Workshops/:workshopSlug'} render={(props) => {
                return <WorkshopPage key={'WorkshopPage'} {...props} />
            }} />
            <Route exact path={'/groupClasses/:workshopSlug'} render={(props) => {
                return <WorkshopPage key={'groupClasses'} {...props} />
            }} />
            
            <Route exact path={'/messagePage'} render={() => {
                return <MessagePage key={'messagePage'} />
            }} />
            <Route exact path={'/masters/:masterSlug/reservePackage/:packageSlug'}
                render={() => {
                    return <ReservePage key={'ReservePage'} />
                }} />
            <Route exact path={'/masters'} render={() => {
                return <MastersPage key={'MastersPage'} />
            }} />
            <Route exact path={'/masters/:id'} render={(props) => {
                return <MasterPage {...props} key={'MasterPage'} />
            }} />
            <Route exact path={'/Categories/:categorySlug/:staffPackageSlug'} render={(props) => {
                return <OnlineClassPage {...props} key={'OnlineClassPage'} />
            }} />
            <Route exact path={'/'} render={() => {
                return <HomePage key={'HomePage'} />
            }} />
            <Route exact path={'/signUp'} render={() => {
                return <AuthPage type={'signup'} key={'AuthPage'} />
            }} />
            <Route exact path={'/signIn'} render={() => {
                return <AuthPage type={'signin'} key={'AuthPage'} />
            }} />
            <Route exact path={'/forgetPassword'} render={() => {
                return <ForgotPasswordPage type={'forgetPassword'} key={'forgetPassword'} />
            }} />
            <Route exact path={'/blog'} render={() => {
                return <Blog key={'/blog'} />
            }} />
            <Route exact path={'/blog/categories/:categorySlug'} render={() => {
                return <Blog category key={Math.random()} />
            }} />
            <Route exact path={'/blog/posts/:postSlug'} render={() => {
                return <BlogPostPage key={'/blog/:postSlug'} />
            }} />

            <FloatWhatsapp />
        </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(WebsiteRoutes);
