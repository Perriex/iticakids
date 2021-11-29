import React , {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
// import Ellipsis from '@bit/joshk.react-spinners-css.ellipsis';
import BeatLoader from "react-spinners/BeatLoader";

const useStyles = makeStyles(theme => ({
    root: {
        justifyContent:"center",
        alignItems: "center",
        display:"flex",
        flexDirection:'column'
    }
  }));

const Loading = (props) => {
  const {show = true , height} = props;

  const classes = useStyles();
  return (show ? (
      <div className={classes.root} style={{minHeight : height ? height : "250px"}} >
        {/* <Ellipsis color="#f76500" /> */}
        <BeatLoader />
        <p>please wait ...</p>
      </div>
    ) : null
  );
};

export default Loading;
