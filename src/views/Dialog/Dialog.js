import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import Loading from "../Loading";

export default function AlertDialog(props) {
  const {open_dialog, msg , title , showLoading , negative_btn , positive_btn , on_negative_btn , on_positive_btn } = props;
  const [open, setOpen] = React.useState(open_dialog);

  React.useEffect(() => {
    setOpen(open_dialog);
  } , [open_dialog])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (result) => {
      if(result){
        if(on_positive_btn){
            on_positive_btn();
        }
      }else{
          if(on_negative_btn){
            on_negative_btn();
          }
      }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {showLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  <Typography>
                    {msg}
                  </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(true)} color="primary">
                {positive_btn}
              </Button>
              <Button onClick={() => handleClose()} color="primary">
                {negative_btn}
              </Button>
            </DialogActions>
          </Fragment>
        )}
      </Dialog>
    </div>
  );
}
