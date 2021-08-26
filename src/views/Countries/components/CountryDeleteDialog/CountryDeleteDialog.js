import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Lang from "../../../../Language";
import { Typography } from '@material-ui/core';

const CountryDeleteDialog = props => {


    const { openDialog , onDialogClosed} = props;
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      setOpen(openDialog);
    } , [openDialog]);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = (can_delete) => {
        if(onDialogClosed){
            onDialogClosed(can_delete);
        }
    };
    

    return (
      <div>
        <Dialog open={open} onClose={() => handleClose()} fullWidth aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{Lang.countries.form.title}</DialogTitle>
          <DialogContent>
            <Typography>
              {Lang.packages.delete}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
            {Lang.common.cancel}
            </Button>
            <Button onClick={() => {
                handleClose(true)
            }} color="secondary">
              {Lang.common.delete}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};


export default CountryDeleteDialog;
