import React , {forwardRef , useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import FilterIcon from "@material-ui/icons/FilterList";
import { Button , FormControl,Select ,InputLabel , MenuItem , TextField} from '@material-ui/core';

import { SearchInput } from '../../components';
import Lang from "../../Language";

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
  columnSelect:{
      minWidth:150
  },
  space : {
      margin : theme.spacing(1)
  }
}));

const Filter = props => {
const { className , columns , categories , onFilter , ...rest } = props;

const [order_columns , setOrderColumns ] = useState(columns ? columns : [])

const [search , setSearch] = useState("");
const [selectedColumn , setSelectedColumn] = useState("");
const [selectedCategory , setSelectedCategory] = useState();
const [selectedDir , setSelectedDir] = useState("");
const [selectedLength , setSelectedLength] = useState("");

  const classes = useStyles();

const setOnFilter = () => {
    if(onFilter){
      if(categories){
        onFilter(search , selectedColumn , selectedCategory , selectedDir , selectedLength);
      }else{
        onFilter(search , selectedColumn , selectedDir , selectedLength);
      }
    }
}

const mapCategories = (cats , parent) => {
  let data = [];
  cats.forEach(k => {
    let temp = {...k};
    if(parent){
      temp.title = parent.title + " - " + temp.title;
    }
    data.push(temp);
    if(temp.childs.length){
      data = data.concat(mapCategories(temp.childs , temp));
    }
  })
  
  return data;
}

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <SearchInput
            className={classes.searchInput}
            placeholder={Lang.filter.search}
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
        />
        <FormControl variant="outlined" className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
            <InputLabel id="demo-simple-select-outlined-label">{Lang.filter.column}</InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label={Lang.filter.column}
            value={selectedColumn}
            onChange={(e) =>setSelectedColumn(e.target.value) }
            >
            <MenuItem value="">
            </MenuItem>
            {order_columns.map((k , i ) => {
                return (
                    <MenuItem key={i} value={k}>{Lang.columns[k]}</MenuItem>
                )
            })}
            </Select>
        </FormControl>
        {categories ? (
           <FormControl variant="outlined" className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
              <InputLabel id="cats">{Lang.filter.category}</InputLabel>
              <Select
              labelId="cats"
              id="cats"
              label={Lang.filter.category}
              value={selectedCategory}
              onChange={(e) =>setSelectedCategory(e.target.value) }
              >
              <MenuItem value="">
              </MenuItem>
              {mapCategories(categories).map((k , i ) => {
                  return (
                  <MenuItem key={i} value={k.id}>{k.title}</MenuItem>
                  )
              })}
              </Select>
          </FormControl>
        ) : null}
        <FormControl variant="outlined" className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
            <InputLabel id="demo-simple-select-outlined-label">{Lang.filter.dir}</InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined2"
            label={Lang.filter.dir}
            value={selectedDir}
            onChange={(e)=>setSelectedDir(e.target.value)}
            >
            <MenuItem value={"asc"}>{Lang.dir.asc}</MenuItem>
            <MenuItem value={"desc"}>{Lang.dir.desc}</MenuItem>
            </Select>
        </FormControl>
        <FormControl variant="outlined" className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
            <TextField
                fullWidth
                label={Lang.filter.length}
                margin="dense"
                name="length"
                type="number"
                value={selectedLength}
                onChange={(e)=>setSelectedLength(e.target.value)}
                required
                variant="outlined"
            />
        </FormControl>
        
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<FilterIcon />}
            onClick={setOnFilter}
            >
            {Lang.filter.filter}
        </Button>
      </div>
    </div>
  );
};

Filter.propTypes = {
  className: PropTypes.string
};

export default Filter;
