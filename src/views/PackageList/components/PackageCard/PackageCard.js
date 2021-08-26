import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  Button
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: 150,
    width: "100%",
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom : 20
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1),
  },
  dec : {
    maxHeight: 150,
    overflow : "hidden",
    wordBreak : "break-all"
  }
}));

const PackageCard = props => {
  const { className, product , onDeleteClick , onEditClick, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.imageContainer}>
          <img
            alt="Product"
            className={classes.image}
            src={product.image ? axios.defaults.baseURL + product.image : null}
            onClick={() => onEditClick? onEditClick(product) : ''}
          />
        </div>
        <Typography
          align="center"
          gutterBottom
          variant="h4"
          onClick={() => onEditClick? onEditClick(product) : ''}
        >
          {product.name}
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: product.text }} className={classes.dec}/>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Grid
            className={classes.statsItem}
            item
          >
            <AccessTimeIcon className={classes.statsIcon} />
            <Typography
              display="inline"
              variant="body2"
            >{product.created_at_p}
            </Typography>
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<EditIcon/>}
                onClick={() => onEditClick? onEditClick(product) : ''}
              >
                {Lang.common.edit}
              </Button>
             <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={()=> onDeleteClick(product)}
              >
                {Lang.common.delete}
              </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

PackageCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default PackageCard;
