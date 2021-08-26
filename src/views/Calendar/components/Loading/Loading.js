import React , {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
// import Ellipsis from '@bit/joshk.react-spinners-css.ellipsis';

const useStyles = makeStyles(theme => ({
    root: {
        justifyContent:"center",
        alignItems: "center",
        minHeight : "250px",
        display:"flex"
    }
  }));

const Loading = (props) => {
  const {isLoading = true } = props;

  const classes = useStyles();
  return (isLoading ? (
      <div className={classes.root} >
        {/* <Ellipsis color="#967737" /> */}
      </div>
    ) : null
  );
};

export default Loading;
