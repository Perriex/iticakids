import React , {useState , Fragment} from 'react';
import { makeStyles } from '@material-ui/styles';
import {WorkshopToolbar , WorkshopTable} from "./components";
import Loading from "../Loading";
import axios from "axios";
import Dialog from "../Dialog";
import Lang from "../../Language";
import { Toast } from "../../config/ToastConfig/Toast.config";

const useStyles = makeStyles(theme => ({
    root: {
        padding : theme.spacing(3)
    },
    content: {
        paddingTop: theme.spacing(3)
    }
  }));

  const Posts = (props) => {
      
    const classes = useStyles();

    const [showLoading , setLoadingState] = useState(true);
    const [showDeleteDialog , setDeleteDialogState] = useState(false);
    const [workshops , setWorkshops] = useState([]);
    const [workshopToEdit ,setWorkshopToEdit] = useState({});
    const [pagination_info , setPaginationInfo] = useState({});
    const [filterData , setFilterData] = useState({});

    React.useEffect(() => {
        filterWorkshops();
    }, []);

    
    const filterWorkshops = (search, column , dir, length , page) => {
        // return;
        let data = filterData;
        data = {
          search: search,
          column: column,
          dir: dir,
          length: length
        };

        setFilterData(data);
        
        axios.get('api/admin/workshops/filter', {params : {...data , page : page}}).then(res => {
            setWorkshops(res.data.data);
            setPaginationInfo(res.data);
            setLoadingState(false);
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        });
    };

    const deleteWorkshop = () => {
        setDeleteDialogState(false);
        setLoadingState(true);
        axios.delete('api/admin/workshops/'+workshopToEdit.slug).then(res => {
            // window.location.reload();
            filterWorkshops();
            Toast(Lang.common.success , "success");
        }).catch(err => {
            setLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        });
    }

    const setDeleteDialog = (workshop) => {
        setWorkshopToEdit(workshop);
        setDeleteDialogState(true);
    }

    return (
        <div className={classes.root}>
            {showLoading ? (
            <Loading />
            ) : (
            <Fragment>
                <WorkshopToolbar onFilter={filterWorkshops}/>
                <Dialog 
                    open_dialog={showDeleteDialog}
                    msg={Lang.workshop.delete_msg}
                    title={Lang.common.warning}
                    negative_btn={Lang.common.cancel}
                    positive_btn={Lang.common.yes}
                    on_negative_btn={()=> setDeleteDialogState(false)}
                    on_positive_btn={deleteWorkshop}
                />
                <div className={classes.content} >
                    <WorkshopTable workshops={workshops} workshopDeleteClick={setDeleteDialog} paginate={pagination_info}/>
                </div>
            </Fragment>
            )}
        </div>
    );
};

export default Posts;
