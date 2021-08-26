import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Lang from "../../../../Language";

const UserActivateDialog = props => {

    
    const { openDialog , onDialogClosed , user, current_package} = props;

    const [open, setOpen] = React.useState(false);

    if(openDialog != open){
        setOpen(true);  
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (state) => {
        if(onDialogClosed){
            onDialogClosed(state);
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
          <DialogTitle id="alert-dialog-title">{Lang.users.activate.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {user ?  (
                <p>
                  {user.is_active == 1 ? Lang.users.activate.deactive : Lang.users.activate.active} {user.name} ?
                </p>
              ): ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(!(user.is_active == 1))} color="primary">
            {user ?  (
                <span>
                  {user.is_active == 1 ? Lang.users.state.deactive : Lang.users.state.active}
                </span>
              ): ""}
            </Button>
            <Button onClick={() => handleClose()} color="primary" autoFocus>
              {Lang.common.cancel}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};


export default UserActivateDialog;
