import React , {forwardRef} from 'react';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import Lang from "../../../../../../Language";

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
  >
    <RouterLink {...props} />
  </div>
));


const useStyles = makeStyles(theme => ({
  root: {
      marginRight: theme.spacing(3)
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const UserBookingToolbar = props => {
  const { className , user_id, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
            color="primary"
            variant="contained"
            component={CustomRouterLink}
            to={window.dashboard_url + "/reports/users/"+user_id+"/booking/new"}
          >
            {Lang.Booking.add}
          </Button>
      </div>
    </div>
  );
};

export default UserBookingToolbar;
