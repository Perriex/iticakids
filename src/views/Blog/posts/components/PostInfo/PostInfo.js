import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import placeholder from "../../../../../assets/placeholder.png";
import Editor from "../../../../../components/Editor";
import Loading from "../../../../Loading";
import { Toast } from "../../../../../config/ToastConfig/Toast.config";
import Lang from "../../../../../Language";
import Validator from "../../../../../Validator";
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  media: {
    height: "100%",
    width: "100%",
    maxheight: "200px",
    objectFit: "cover"
  },
}));

const PostInfo = props => {
  const { className, ...rest } = props;

  const [isEdit] = useState(!!props.match.params.blog_slug)
  const [post_slug, setPostSlug] = useState(props.match.params.blog_slug);
  const [post, setPost] = useState({ json: {} });
  const [showLoading, setLoadingState] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = React.useState("");
  const [body, setBody] = React.useState("");
  const [brief, setBrief] = React.useState("");


  React.useEffect(() => {
    if (isEdit) {
      getPostInfo();
    }
    getCategories();
  }, []);

  const mapCategories = (cats, parent) => {
    let data = [];
    cats.forEach(k => {
      let temp = { ...k };
      if (parent) {
        temp.title = parent.title + " - " + temp.title;
      }
      data.push(temp);
      if (temp.childs.length) {
        data = data.concat(mapCategories(temp.childs, temp));
      }
    })
    return data;
  }


  const getCategories = () => {
    axios.get('api/v1.0/blog/cats').then(res => {
      setCategories(res.data);
    }).catch(err => {
      Toast(Lang.common.connection_error, "danger");
      setLoadingState(false);
    });
  };

  const getPostInfo = () => {
    setLoadingState(true);

    axios.get(`api/admin/blog/posts/${post_slug}`).then(res => {
      let data = res.data;
      if (res.data.json) {
        data.json = JSON.parse(res.data.json);
      } else {
        data.json = {};
      }
      setPost(data);
      setBody(data.body)
      setBrief(data.brief)
      if (res.data.banner) {
        setImage(axios.defaults.baseURL + res.data.banner);
      }
      setLoadingState(false);
    }).catch(err => {

      Toast(Lang.common.connection_error, "danger");
      setLoadingState(false);
    });
  }

  const classes = useStyles();

  const imageSelectedHandler = e => {
    if (!e.target.files.length) {
      return;
    }
    let avatar = e.target.files[0];
    setImage(e.target.files[0].name);
    setPostData("banner", avatar);
    // updateUser(user.name, user.family, avatar);

    // TODO this part can be deleted until end of this function. -------------------
    // because the avatar should be loaded from props, not state!
    var reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    // setImageName(e.target.files[0].name);
    reader.readAsDataURL(e.target.files[0]);
  };

  const setPostData = (name, data, is_json = false) => {
    if (is_json) {
      setPost({ ...post, json: { ...post.json, [name]: data } });
    } else {
      setPost({ ...post, [name]: data });
    }
  }

  const currentCategory = () => {
    let cat = mapCategories(categories).find(k => k.id == post.cat_id);
    if (cat) {
      return cat;
    }
    return { title: "-", id: null };
  }

  const submitPost = () => {
    if (isEdit) {
      updatePost();
    } else {
      newPost();
    }
  }

  const updatePost = () => {
    setLoadingState(true);
    let data = new FormData();

    data.append("title", post.title);
    data.append("body", post.body);
    data.append("brief", post.brief);
    if (post.cat_id) {
      data.append("cat_id", post.cat_id);
    }
    data.append("active", post.active);
    data.append("banner", post.banner);
    data.append("json", JSON.stringify(post.json));

    axios.post(`api/admin/blog/posts/${post_slug}`, data).then(res => {
      setLoadingState(false);
      Toast(Lang.blog.form.success_update_msg, "success");
      // window.location.href = axios.defaults.dashboard + "blog";
      props.history.replace(window.dashboard_url + "/blog");
    }).catch(err => {
      setLoadingState(false);
      if (err.response.status == 422) {
        Toast(Lang.common.input_error, "danger");
      } else {
        Toast(Lang.common.connection_error, "danger");
      }
    });
  }

  const newPost = () => {
    setLoadingState(true);
    let data = new FormData();

    data.append("title", post.title);
    data.append("body", post.body);
    data.append("brief", post.brief);
    if (post.cat_id) {
      data.append("cat_id", post.cat_id);
    }
    data.append("active", post.active);
    data.append("banner", post.banner);
    data.append("json", JSON.stringify(post.json));

    axios.post(`api/admin/blog/posts`, data).then(res => {
      setLoadingState(false);
      Toast(Lang.blog.form.success_new_msg, "success");
      // window.location.href = axios.defaults.dashboard + "blog";
      props.history.replace(window.dashboard_url + "/blog");
    }).catch(err => {
      setLoadingState(false);
      if (err.response.status == 422) {
        Toast(Lang.common.input_error, "danger");
      } else {
        Toast(Lang.common.connection_error, "danger");
      }
    });
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {showLoading ? (
        <Loading />
      ) : (
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Typography variant="h2" component="h2">
              {isEdit ? Lang.blog.edit_title : Lang.blog.new_title}
            </Typography>
            <Divider />
            <Grid container>
              <Grid item md={3} xs={12} className={classes.root}>

                <div className={classes.details}>
                  <img
                    className={classes.media}
                    src={image ? image : placeholder}
                  />
                </div>
                <input onChange={imageSelectedHandler} style={{ display: 'none' }} accept="image/*" className={classes.input} id="contained-button-file" multiple type="file" />
                <label htmlFor="contained-button-file">
                  <Button className={classes.uploadButton} color="primary" variant="text" component="span">
                    {Lang.blog.form.select_banner}
                  </Button>
                </label>
                <FormControl variant="outlined" fullWidth className={[classes.formControl, classes.space, classes.columnSelect].join(" ")}>
                  <TextField
                    className={classes.marginBottom}
                    id="title"
                    label={Lang.blog.form.title}
                    required
                    type="text"
                    value={post.title}
                    error={Validator.checkInput("title", post)}
                    helperText={Lang.blog.title_hint}
                    variant="outlined"
                    onChange={(t) => setPostData("title", t.target.value)}
                  />
                </FormControl>
                <FormControl variant="outlined" fullWidth className={[classes.formControl, classes.space, classes.columnSelect].join(" ")}>
                  <Autocomplete
                    value={currentCategory()}
                    id="categories"
                    className={classes.marginBottom}
                    options={mapCategories(categories)}
                    getOptionLabel={(option) => option.title ? option.title : ""}
                    fullWidth
                    onChange={(event, newValue) => {
                      setPostData("cat_id", newValue ? newValue.id : null)
                    }}
                    renderInput={(params) => <TextField {...params} label={Lang.blog.form.category} variant="outlined" />}
                  />
                </FormControl>
                <FormControl variant="outlined" fullWidth className={[classes.formControl, classes.space, classes.columnSelect].join(" ")}>
                  <TextField
                    className={classes.marginBottom}
                    id="title"
                    label="Keywords"
                    required
                    type="text"
                    value={post.json.keywords}
                    variant="outlined"
                    onChange={(t) => setPostData("keywords", t.target.value, true)}
                  />
                </FormControl>
                <FormControl variant="outlined" fullWidth className={[classes.formControl, classes.space, classes.columnSelect].join(" ")}>
                  <TextField
                    className={classes.marginBottom}
                    id="title"
                    label="seo"
                    required
                    type="text"
                    value={post.json.seo}
                    variant="outlined"
                    multiline
                    onChange={(t) => setPostData("seo", t.target.value, true)}
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox checked={post.active == 1} onChange={(t) => setPostData("active", t.target.checked ? 1 : 0)} name="active" />}
                  label={Lang.blog.form.is_active}
                />
              </Grid>
              <Grid item md={9} xs={12} className={classes.root}>
                <h3>post brief</h3>
                <Editor
                  apiKey="f1of5cynghcbae8ubznimgwksqvn4azrbnaf2x3fq9ilped8"

                  model={brief}
                  onModelChange={(t) => setPostData("brief", t)}
                  className={classes.editor}
                />
                <h3>post body</h3>

                <Editor
                  apiKey="f1of5cynghcbae8ubznimgwksqvn4azrbnaf2x3fq9ilped8"

                  model={body}
                  onModelChange={(t) => setPostData("body", t)}
                  className={classes.editor}
                />

              </Grid>



            </Grid>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={() => {
              if (!post.body) {
                Toast(Lang.blog.form.body_error_msg, "error");
              }
              if (Validator.isFormValid() && post.body) {
                submitPost();
              }
            }} color="primary">
              {Lang.common.save}
            </Button>
          </CardActions>
        </Card>

      )}
    </div>
  );
};


export default withRouter(PostInfo);
