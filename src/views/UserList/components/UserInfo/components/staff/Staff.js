import React, { useState  , Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Card, CardContent, Divider, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import UserStaffDetails from '../../../../components/UserStaffDetails';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import Loading from "../../../../../Loading";
import Lang from "../../../../../../Language";
import { Toast } from "../../../../../../config/ToastConfig/Toast.config";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  marginTop: {
    marginTop: theme.spacing(1)
  }
}));

const UserInfo = props => {

  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { openDialog, onDialogClosed, current_package } = props;

  // const [user, setUserInfo] = useState(getUserInfo(props.match.params.user_id));
  const [user, setUserInfo] = useState({});
  const [showLoading, setLoadingState] = useState(true);
  const [ newProfile , setNewProfile ] = useState(false)

  React.useEffect(() => {
    if(props.match.params.user_id){
      axios.get(`api/admin/users/${props.match.params.user_id}/full`).then(res => {
        setLoadingState(false);
        let user = res.data.data;
        if(user.staff){
          user.staff.json = JSON.parse(user.staff.json);
        }
        setUserInfo(user);
      }).catch(err => {
        setLoadingState(false);
        Toast(Lang.common.connection_error , "danger");
      });
    }else{
      setNewProfile(true);
      setLoadingState(false);
      setUserInfo({id : null});
      setUserInfo({id : null});
    }
  }, []);
  const setUserStaff = () => {
    setUserInfo({ ...user, staff: { user_id: user.id } });
  };

  return (
    <div>
      {showLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <div className={classes.root}>
            {!newProfile ? (
              <div>
                {user.staff ? (
                  <UserStaffDetails user_info={user}/>
                ) : (
                  <Card className={classes.marginTop}>
                    <CardContent>
                      <Typography component="h5" variant="h5" >
                        {Lang.users.staff.no_staff}
                      </Typography>
                      <Divider ligth="true"/>
                      <Button className={classes.marginTop} color="secondary" onClick={setUserStaff} startIcon={<AddIcon/>} variant="contained" >
                        {Lang.users.staff.turn}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </div>
        </Fragment>
      )}
    </div>
  );
};


export default withRouter(UserInfo);
