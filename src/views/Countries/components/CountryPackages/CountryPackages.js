import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Button , Dialog,Grid ,Card,CardContent ,CardMedia,CardActionArea, CardActions , Typography } from '@material-ui/core';
import Loading from "../../../Loading";
import axios from "axios";
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
  root: {},
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
  },
  list : {
    padding:10,
    maxHeight: 500
  }
}));

const CountryPackages = props => {
  const { packages , loading, country , ...rest } = props;
  const classes = useStyles();

  
  return (
    <Card className={classes.root}>
      {loading ? (
        <Loading/>
      ) : (
        <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {Lang.countries.packages_of}{country ? country.name : ""}
        </Typography>
        <PerfectScrollbar>
        <Grid
            container
            spacing={2}
            className={classes.list}
          >
          {packages.map((mpackage , i)=>{
            return (
              <Grid
                item
                key={i}
                lg={4}
                md={6}
                xs={12}
              >
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="140"
                    image={mpackage.image ? axios.defaults.baseURL + mpackage.image : null}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {mpackage.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {/* <CardActions>
                  <Button size="small" color="primary">
                    Learn More 
                  </Button>
                </CardActions> */}
              </Card>
            </Grid>
            )
          })}
          </Grid>
        </PerfectScrollbar>
        </CardContent>
      )}
      
    </Card>
  );
};

CountryPackages.propTypes = {
  className: PropTypes.string
};

export default CountryPackages;
