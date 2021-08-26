import React , {useState , Fragment} from 'react';
import { makeStyles } from '@material-ui/styles';
import Loading from "../../../../Loading";
import { 
    Grid,
    Card ,
    CardContent ,
    Typography ,
    CardActions ,
    Button ,
    List,
    ListSubheader,
    ListItem,
    Collapse,
    Divider,
    IconButton ,
    FormControl,
    TextField,
 } from '@material-ui/core';
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from "../../../../Dialog";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SelectIcon from '@material-ui/icons/Check';
import Lang from "../../../../../Language";
import Validator from "../../../../../Validator";
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        padding : theme.spacing(3)
    },
    content: {
        paddingTop: theme.spacing(1)
    },
    marginBottom : {
        marginBottom : theme.spacing(2)
    },
    card : {
        padding : theme.spacing(3),
        margin :theme.spacing(2)
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    rightSide : {
        marginLeft : "auto"
    },
    flex : {
        width : "100%",
        display : "flex",
        alignItems : "center"
    },
    overflow : {
        maxHeight:550,
        overflow:"auto"
    }
  }));

const Posts = (props) => {

    const [showLoading , setLoadingState] = useState(true);
    const [showDeleteDialog , setDeleteDialogState] = useState(false);
    const [categories , setCategories] = useState([]);
    const [category , setCategory] = useState({});
    const [currentCategory , setCurrentCategory] = useState({});
    const [parentCategory , setParentCategory] = useState({});

    React.useEffect(() => {
        getCategories();
    }, []);

    const resetPage = () => {
        getCategories();
        setCategory({});
        setCurrentCategory({});
        setParentCategory({});
    }

    
    const getCategories = () => {
        setLoadingState(true);
        axios.get('api/v1.0/blog/cats').then(res => {
            setCategories(res.data);
            setLoadingState(false);
        }).catch(err => {
            setLoadingState(false);
        });
    };

    
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

    
    const mapCategoriesView = (cats , parent , level = 0) => {
        let dashes = " ";
        for (let i = 0; i < level; i++) {
            dashes += "- "
        }
        return cats.map(k => {
            
            return (
                <Fragment>
                    <ListItem button  className={parent ? classes.nested : null}>
                        <Typography className={classes.flex}>
                            {(parent ? dashes : "") + k.title}
                            {buttons(k)}
                        </Typography>
                    </ListItem>
                    {k.childs.length ? (
                        <Collapse in={true} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {mapCategoriesView( k.childs , k , level+1)}
                            </List>
                        </Collapse>
                    ) : null}
                </Fragment>
            )
        })
    }
  
    const buttons = (cat) => {
        return (
            <div className={classes.rightSide}>
                <IconButton aria-label="delete" color="secondary" onClick={() => {
                    setDeleteDialogState(true);
                    setCurrentCategory(cat);
                }}>
                    <DeleteIcon fontSize="small"/>
                </IconButton>
                 <IconButton aria-label="delete" color="primary" onClick={() => {
                    setCategory(cat);
                    if(cat.parent_id){
                        setParentCategory(mapCategories(categories).find(k => k.id == cat.parent_id));
                    }else{
                        setParentCategory({})
                    }
                 }}>
                    <EditIcon fontSize="small"/>
                </IconButton>
                 <IconButton aria-label="delete" color="primary" onClick={() => {
                     setParentCategory(cat);
                     setCategory({...category , parent_id : cat.id});
                 }}>
                    <SelectIcon fontSize="small"/>
                </IconButton>
            </div>
        )
    }

    const deleteCategory = () => {
        setDeleteDialogState(false)
        setLoadingState(true);
        axios.delete('api/admin/blog/cats/'+currentCategory.slug ).then(res => {
            setLoadingState(false);
            resetPage();
            // window.location.href = axios.defaults.dashboard + "blog/cats";
        }).catch(err => {
            setLoadingState(false);
        });
    }

    const setCatData = (name , data)=>{
        setCategory({...category , [name] : data});
    }
    
    const getCurrentCategory = () => {
        let cat = mapCategories(categories).find(k => k.id == parentCategory.id);
        if(cat){
            return cat;
        }
        return {title : "-" , id : null};
    }

    const saveCategory = () => {
        if(category.slug){
            updateCategory();
        }else{
            newCategory();
        }
    }

    const updateCategory = () => {
        setLoadingState(true);
        axios.post('api/admin/blog/cats/'+category.slug , category).then(res => {
            setLoadingState(false);
            // window.location.href = axios.defaults.dashboard + "blog/cats";
            // props.history.replace(axios.defaults.dashboard + "blog/cats")
            resetPage();
        }).catch(err => {
            setLoadingState(false);
        });
    }

    const newCategory = () => {
        setLoadingState(true);
        axios.post('api/admin/blog/cats' , category).then(res => {
            setLoadingState(false);
            // window.location.href = axios.defaults.dashboard + "blog/cats";
            // props.history.replace(axios.defaults.dashboard + "blog/cats");
            resetPage();
        }).catch(err => {
            setLoadingState(false);
        });
    }

      
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {showLoading ? (
            <Loading />
            ) : (
                <Fragment>
                    <Dialog 
                        open_dialog={showDeleteDialog}
                        msg={Lang.blog.delete_cat_msg}
                        title={Lang.common.warning}
                        negative_btn={Lang.common.cancel}
                        positive_btn={Lang.common.yes}
                        on_negative_btn={() => setDeleteDialogState(false)}
                        on_positive_btn={deleteCategory}
                    />
                    <Grid container>
                        <Grid item md={6} xs={12} className={classes.content}>
                            <Card className={classes.card}>
                                <CardContent className={classes.overflow}>
                                    <List
                                        component="nav"
                                        aria-labelledby="nested-list-subheader"
                                        subheader={
                                            <ListSubheader component="h4" id="nested-list-subheader">
                                            {Lang.blog.categories.categories}
                                            </ListSubheader>
                                        }
                                        className={classes.root}
                                        >
                                        <Divider/>
                                        {mapCategoriesView(categories)}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12} className={classes.content}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <FormControl variant="outlined" fullWidth className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
                                        <TextField
                                            className={classes.marginBottom}
                                            id="title"
                                            label={Lang.blog.categories.title}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            type="text"
                                            error={Validator.checkInput("title" , category)}
                                            value={category.title}
                                            helperText={Lang.blog.title_hint}
                                            variant="outlined"
                                            onChange={(t) => setCatData("title" , t.target.value)}
                                        />
                                        </FormControl>
                                        <FormControl variant="outlined" fullWidth className={[classes.formControl , classes.space , classes.columnSelect].join(" ")}>
                                        <Autocomplete
                                            value={getCurrentCategory()}
                                            id="categories"
                                            className={classes.marginBottom}
                                            options={mapCategories(categories)}
                                            getOptionLabel={(option) => option.title ? option.title : ""}
                                            fullWidth
                                            onChange={(event, newValue) => {
                                                setParentCategory(newValue ? newValue : {});
                                                setCatData("parent_id" , newValue ? newValue.id : null);
                                            }}
                                            renderInput={(params) => <TextField {...params} label={Lang.blog.categories.category} variant="outlined" />}
                                        />
                                    </FormControl>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="primary" onClick={() => {
                                        if(Validator.isFormValid()){
                                            saveCategory()
                                        }
                                    }}>
                                    {Lang.common.save}
                                    </Button>
                                    { category.title || parentCategory.title ? (
                                        <Button variant="contained" color="primary" onClick={() => {
                                            setCategory({title : "" , parent_id : null});
                                            setParentCategory({});
                                        }}>
                                           {Lang.blog.categories.reset_form}
                                        </Button>
                                    ) : null}
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Fragment>
            )}
        </div>
    );
};

export default withRouter(Posts);
