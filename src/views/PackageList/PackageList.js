import React, { useState , Fragment} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import Loading from "../Loading";
import { Toast } from "../../config/ToastConfig/Toast.config"
import Lang from "../../Language"

import { PackagesToolbar, PackageCard , PackageDeleteDialog , PackageDialog} from './components';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));

const PackageList = () => {
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [search , setSearch ] = useState("");
  const [currentPackage , setCurrentPackage] = useState(null);

  const [openDeleteDialog , setDeleteDialogState] = useState(false);
  const [openPackageDialog , setPackageDialogState] = useState(false);
  const [currentCountries , setCurrentCountries] = useState();
  const [ showLoading , setLoading ] = useState(true);


  React.useEffect(() => {
    fetchPackages();
  }, []);


  const fetchPackages = () => {
    setLoading(true);
    getPackages(res => {
      setProducts(res.data.data);
      setLoading(false);
    })
  }
  // --------------------------- TODO Admin Packages Management ------------------------

  const getPackages = callback => {
    axios.get('api/admin/packages').then(res => callback(res)).catch(err => {});
  };

  const defineNewPackage = (mpackage) => {
    setLoading(true);
    let data = new FormData();
    data.append('name', mpackage.name);
    data.append('text', mpackage.text);
    data.append('image', mpackage.image);
    data.append('visible', mpackage.visible == 1 ? 1 : 0);
    data.append('keywords', mpackage.keywords);
    if (mpackage.json) data.append('json', JSON.stringify(mpackage.json));
    if (mpackage.countries) data.append('countries', JSON.stringify(mpackage.countries));

    axios.post('api/admin/packages', data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'  // important in sending images
      }
    }).then(res => {
      fetchPackages();
      Toast(Lang.common.success , "success");
    }).catch(err => {
        if(err.response.status == 422){
            Toast(Lang.common.input_error, "danger");
        }else{
            Toast(Lang.common.connection_error, "danger");
        }
        setLoading(false);
    });
  };

  const getSpecificPackageInfo = (package_slug, callback) => {
    // TODO api/admin/packages/${package_slug} -> getSpecificPackageInfo
    axios.get(`api/admin/packages/${package_slug}`).then(res => callback(res)).catch(err => {});
  };
  const packageUpdateInfo = (package_slug, mpackage) => {
    setLoading(true);
    let data = new FormData();
    data.append('name', mpackage.name);
    data.append('text', mpackage.text);
    data.append('remove_image', mpackage.remove_image == undefined ? 0 : mpackage.remove_image);
    data.append('visible', mpackage.visible == 1 ? 1 : 0);
    if (mpackage.image != null && typeof mpackage.image != "string") data.append('image', mpackage.image);
    data.append('keywords', mpackage.keywords);
    if (mpackage.json) data.append('json', JSON.stringify(mpackage.json));
    if (mpackage.countries) data.append('countries', JSON.stringify(mpackage.countries));
    axios.post(`api/admin/packages/${package_slug}`, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'  // important in sending images
      }
    }).then(res => {
      fetchPackages();

      Toast(Lang.common.success , "success");
    }).catch(err => {

        if(err.response.status == 422){
            Toast(Lang.common.input_error, "danger");
        }else{
            Toast(Lang.common.connection_error, "danger");
        }
      // fetchPackages();
      setLoading(false);
    });
  };

  const deleteSpecificPackage = (package_slug) => {
    setLoading(true)
    axios.delete(`api/admin/packages/${package_slug}`).then(res => {
        fetchPackages();

      Toast(Lang.common.success , "success");
    }).catch(err => {
      setLoading(false);
      Toast(Lang.common.connection_error , "danger");
    });
  };

  const filterPackages = (search, column, dir, length) => {
    // TODO filterCountries
    const data = {
      search: search,
      column: column,
      dir: dir,
      length: length
    };
    // ino eshtebahi neveshti GET
    axios.post('api/admin/packages/filter', data).then(res => {

    }).catch(err => {});
  };

  const onPackageAdd = () => {
    setCurrentPackage({id:null});
    setPackageDialogState(true);
  }

  const onPackageDelete = (_package) => {
      setCurrentPackage(_package);
      setDeleteDialogState(true);
  }

  const closeDeleteDialog = (can_delete) => {
    if(can_delete){
      deleteSpecificPackage(currentPackage.slug);
    }
    setDeleteDialogState(false);
  }

  const closePacakgeDialog = (mpackage) => {
    if(mpackage){
      if(currentPackage.id){
        packageUpdateInfo(currentPackage.slug , mpackage);
      }else{
        defineNewPackage(mpackage);
      }
    }
    setPackageDialogState(false);
  }

  const onPackageEdit = (_package) => {

    try {
      _package.json = JSON.parse(_package.json);
    } catch (error) {
    }
    setCurrentPackage({..._package});
    let countries = [];

    if(_package.countries){
        countries = _package.countries.map(k => {return k.id});
    }

    setCurrentCountries(countries);
    setPackageDialogState(true);
  }

  return (
    <Fragment>
      {showLoading ? (
        <Loading />
      ): (
        <div className={classes.root}>
          <PackagesToolbar onAdd={onPackageAdd} onChange={(_package)=>{setSearch(_package)}} />
          <PackageDeleteDialog openDialog={openDeleteDialog} current_package={currentPackage} onDialogClosed={closeDeleteDialog}/>
          <PackageDialog currentCountries={currentCountries} currentPackage={currentPackage} openDialog={openPackageDialog} onDialogClosed={closePacakgeDialog}/>
          <div className={classes.content}>
            <Grid
              container
              spacing={3}
            >
              {products.filter(k => k.name.toLowerCase().includes(search.toLowerCase())).map(product => (
                <Grid
                  item
                  key={product.id}
                  md={2}
                  xs={12}
                >
                  <PackageCard product={product} onDeleteClick={onPackageDelete} onEditClick={onPackageEdit} />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default PackageList;
