import React, { useState } from 'react';
import { FormControl , InputLabel , Select , Input , Chip , MenuItem} from '@material-ui/core';
import { makeStyles , useTheme  } from '@material-ui/styles';
import axios from "axios";
import Lang from "../../../../Language";

const useStyles = makeStyles(theme => ({
    delete: {
      padding: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
    },
    country : {
        padding:5
    },
    countryRow : {
        margin: 4
    }
    ,chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      noLabel: {
        marginTop: theme.spacing(3),
      },
  }));


  const getCountries = (callback) => {
    // TODO --> This is done: Look at React.useEffect() at the top of this function
    axios.get('api/admin/countries').then(res => {
      callback(res);
    }).then(err => {
        // getCountries(callback)
    })
  };


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };


function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const PackageCountryPicker = props => {

    const classes = useStyles();
    const theme = useTheme();

    const {onSelected , currentCountries } = props;

    const [showValues, setShowValues] = useState(currentCountries);
    const [selecteds , setSelecteds] = useState(currentCountries ? currentCountries : []);
    // if(openDialog != open){
    //     setOpen(true);
    // }
    const [ countries , setCountries ] = React.useState([]);

    React.useEffect(() => {
        getCountries(res => {
            setCountries(res.data.data);
        })
    }, []);



    const deleteFromList = (id) => {
        setSelecteds(selecteds.filter(k => k.id != id));
    }

    const handleChange = (event) => {
        let data = [];
        if(event.target.value){
            data = [countries.find(k => k.id == event.target.value)];
        }
        // for (let i = 0; i < event.target.value.length; i++) {
        //     const temp = event.target.value[i];
        //     data.push(countries.find(k => k.name == temp));
        // }
        setShowValues(data.map(k => k.id));
        setSelecteds(data);
        if(onSelected){
            onSelected(data);
        }
    };
    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">{Lang.packages.form.countries}</InputLabel>
                <Select
                value={showValues}
                onChange={handleChange}
                label={Lang.packages.form.countries}
                inputProps={{
                    id: 'outlined-age-native-simple',
                }}
                >
                    <MenuItem value={null}>None</MenuItem>
                {countries.map((country) => {
                    return (
                        <MenuItem key={country.id} value={country.id}>
                        {country.name}
                        </MenuItem>
                    )
                })}
                </Select>
            </FormControl>
            {/* <hr/>

            <hr/>
            {selecteds.map(k => {
                return (
                    <div className={classes.countryRow}>
                        <Typography>
                            <IconButton aria-label="delete"  onClick={()=> deleteFromList(k.id)} className={classes.margin} size="small">
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                            <span
                                className={classes.country}>
                                {k.name}
                            </span>
                        </Typography>
                    </div>
                )
            })} */}
        </div>
    );
};


export default PackageCountryPicker;
