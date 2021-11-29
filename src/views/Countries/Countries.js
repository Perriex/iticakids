import React, { useState , Fragment} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { CountryToolBar, CountryTable  , CountryAddDialog , CountryDeleteDialog , CountryPackages} from './components';
import Loading from "../Loading";
import axios from 'axios';
import { Toast } from "../../config/ToastConfig/Toast.config"
import Lang from "../../Language";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  no_packages: {
    display : "none"
  }
}));

const Countries = () => {

  const classes = useStyles();

  const [showLoading , setLoadingState] = useState(true);
  const [countries, setCountries] = useState([]);
  const [openDialog , setDialogState] = useState(false);
  const [openDeleteDialog , setDeleteDialogState] = useState(false);
  const [countryToEdit , setCountryToEdit] = useState({});
  const [pagination_info , setPaginationInfo] = useState({});

  const [search , setSearch] = useState("");
  const [showPackages , setShowPackages] = useState(false);
  const [selectedCountry , setSelectedCountry] = useState(null);
  const [countryPackages , setCountryPackages] = useState([]);
  const [packageLoading , setPackageLoading] = useState(true);

  const [filterData , setFilterData] = useState({});

  React.useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    filterCountries();
  }

  const getCountries = (callback) => {
    setLoadingState(true);
    // TODO --> This is done: Look at React.useEffect() at the top of this function
    axios.get('api/admin/countries').then(res => {
      callback(res);
      setLoadingState(false);
    }).then(err => {
      setLoadingState(false);
    })
  };

  const defineNewCountry = (countryName) => {
    setLoadingState(true);
    axios.post('api/admin/countries', {name: countryName.name}).then(res => {
      // setCountries(res.data.data.data);
      Toast(Lang.common.success,"success");
      fetchCountries();
    }).catch(err => {

        setLoadingState(false);
        if(err.response.status == 422){
            Toast(Lang.common.input_error, "danger");
        }else{
            Toast(Lang.common.connection_error, "danger");
        }
    })
  };

  const getCountry = countryId => {

    axios.get(`api/admin/countries/${countryId}`).then(res => {

    }).then(err => {

    });
  };

  const updateCountry = (countryId, country) => {

    setLoadingState(true);

    let data = new FormData();
    data.append('name', country.name);
    data.append('image', country.image);

    axios.post(`api/admin/countries/${countryId}`, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'  // important in sending images
      }
    }).then(res => {
      Toast(Lang.common.success,"success");
      fetchCountries();
    }).catch(err => {
        Toast(Lang.common.connection_error,"danger");
        if(err.response.status == 422){
            Toast(Lang.common.input_error, "danger");
        }else{
            Toast(Lang.common.connection_error, "danger");
        }
    });
  };

  const gatPackagesOfCountry = countryId => {
    // TODO gatPackagesOfCountry
    axios.get(`api/admin/countries/${countryId}/packages`).then(res => {

      setCountryPackages(res.data.data);
      // packages ==> res.data.data
      setPackageLoading(false);
    }).catch(err => {
      Toast(Lang.common.connection_error,"danger");
      setPackageLoading(false);
    });
  };

  const deleteCountry = countryId => {
    // TODO deleteCountry
    setLoadingState(true);
    axios.delete(`api/admin/countries/${countryId}`).then(res => {

      Toast(Lang.common.success,"success");
      fetchCountries();
    }).catch(err => {
      Toast(Lang.common.connection_error,"danger");
      setLoadingState(false);
    });
  };

  const filterCountries = (search, column, dir, length , page) => {
    // return;
    let data = filterData;
    data = {
      search: search,
      column: column,
      dir: dir,
      length: length
    };

    setFilterData(data);

    axios.get('api/admin/countries', {params : {...data , page : page}}).then(res => {
      setCountries(res.data.data.data);
      setPaginationInfo(res.data.data);
      setLoadingState(false);
    }).catch(err => {
      Toast(Lang.common.connection_error,"danger");

    setLoadingState(false);
    });
  };

  const setCountryPage = (page) => {
    filterCountries(filterData.search , filterData.column , filterData.dir, filterData.length , page);
  }

  const onCountryAdd = ()=>{
    setCountryToEdit({id:null , name : ""});
    setDialogState(true);
  };

  const closeDialog = (country) =>{

    if(country){
      if(countryToEdit.id){
        updateCountry(countryToEdit.id , country);
      }else{
        defineNewCountry(country);
      }
    }
    setDialogState(false);
  };

  const countryEditClick = (country) => {
    setCountryToEdit(country);
    setDialogState(true);
  };

  const countryPackagesListClick = (country) => {

    setPackageLoading(true);
    gatPackagesOfCountry(country.id);
    setSelectedCountry(country);
    setShowPackages(true);
  };

  const countryDeleteClick = (country)=>{
    setDeleteDialogState(true);
    setCountryToEdit(country);
  }

  const deleteCloseDialog = (can_delete) => {
    setDeleteDialogState(false);
    if(can_delete){
      deleteCountry(countryToEdit.id);
    }
    setCountryToEdit({});
  }

  return (
    <div className={classes.root}>
      {showLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <CountryToolBar onFilter={filterCountries} onAdd={onCountryAdd} onChange={(country)=>{setSearch(country)}} />
          <CountryAddDialog countryToEdit={countryToEdit} openDialog={openDialog} onDialogClosed={closeDialog}/>
          <CountryDeleteDialog openDialog={openDeleteDialog} onDialogClosed={deleteCloseDialog}/>
          <div className={classes.content}>
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                md={showPackages ? 6 : 12}
                xs={12}
              >
                <CountryTable paginate={pagination_info} setPage={setCountryPage} countries={countries} countryPackagesListClick={countryPackagesListClick} countryEditClick={countryEditClick} countryDeleteClick={countryDeleteClick} />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                className={showPackages ? "" : classes.no_packages}
              >
                  <CountryPackages loading={packageLoading} packages={countryPackages} country={selectedCountry}/>
              </Grid>
            </Grid>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Countries;
