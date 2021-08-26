import React, { Suspense } from 'react';
import { Route,Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import store from 'store';
import { UserList } from '../../views';
import axios from "axios";
import Loading from "../../views/Loading"

const checkLogin = () => {
  let user = store.get("user");
  return user;
}

const checkPermission = (user , permission) => {
    return user.permissions.find(k => k.slug == permission);
}

const checkRole = (user , role) => {
    return user.roles.find(k => k.slug == role);
}

const RouteWithLayout = props => {
  const { layout: Layout, component: Component , noauth , auth , permission , role, ...rest } = props;

  const View = (matchProps) => {
    return (
      // <Suspense fallback={<Loading />} >
        <Layout>
          <Component {...matchProps} />
        </Layout>
      // </Suspense>
    );
  }

  const getPermissionView = (matchProps) => {
    let user = checkLogin();
    if(!user){
      
      window.location.href = axios.defaults.baseURL + '/signIn';
      // return (<Redirect to={{pathname: '/signIn', state: {from: props.location}}} />);
    }
    if(permission){
      if(!checkPermission(user , permission)){
        return (<Redirect to={{pathname: window.dashboard_url + '/not-found', state: {from: props.location}}} />);
      }
      
    }
    return View (matchProps) 
  }

  const getRoleView = (matchProps) => {
    let user = checkLogin();
    if(!user){
      window.location.href = axios.defaults.baseURL + '/signIn';
      // return (<Redirect to={{pathname: '/signIn', state: {from: props.location}}} />);
    }
    if(!checkRole(user , role)){
      return (
        <Redirect to={{pathname: '/not-found', state: {from: props.location}}} />
      );
    }
  }

  const getAuthView = (matchProps) => {
    
    if(!checkLogin()){
      window.location.href = axios.defaults.baseURL + '/signIn';
      // return (<Redirect to={{pathname: '/signIn', state: {from: props.location}}} />);
    }
  };

  const getNoAuthView = (matchProps) => {
    if(checkLogin()){
      return (<Redirect to={{pathname: '/account', state: {from: props.location}}} />);
    }
  };

  const getView = (matchProps) => {
    let result;
    if(noauth){
      result = getNoAuthView(matchProps)
    }

    if(auth){
      result = getAuthView(matchProps)
    }

    if(permission){
      result = getPermissionView(matchProps)
    }

    if(role){
      result = getRoleView(matchProps);
    }

    return result ? result : View (matchProps) ;
  }
  return (
    <Route
      {...rest}
      // render={matchProps => getView(matchProps)}
      render={matchProps => getView(matchProps)}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
