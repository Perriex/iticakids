import React , {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import UserStaffDetails from "../../../UserList/components/UserStaffDetails"
import StaffPackages from "../StaffPackages";
import axios from "axios";
import Loading from "../../../Loading";
import { withRouter } from "react-router-dom"
import Lang from "../../../../Language";
import { Toast } from "../../../../config/ToastConfig/Toast.config";
import Calendar from "../../../../components/TimeTableV2/TimeTable";
import { useHistory } from "react-router-dom";
import StaffBookDialog from "../StaffBookDialog";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    marginTop : {
        marginTop: theme.spacing(1)
    }
  }));

  

const StaffInfo = props => {

    const classes = useStyles();
    
    const history = useHistory();
    const { isProfile , showInfo } = props;

    const [slug , setSlug ] = useState(props.match.params.user_id);
    const [ isEdit ] = useState(!!props.match.params.user_id);
    const [user , setUserInfo] = useState({staff : {}})
    const [packages , setPackages] = useState([]);
    const [ userLoading , setUserLoadingState ] = useState(false);
    const [ packageLoading , setPackageLoadingState ] = useState(false);
    const [open , setOpen ] = useState(false);
    const [ start , setStart ] = useState(null);

    React.useEffect(() => {
        if(isEdit){
            getSpecificStaffInfo(slug)
            getSpecificStaffPackages(slug);
        }
    } , []);
    
    const getSpecificStaffInfo = (staffSlug) => {
        setUserLoadingState(true)
        axios.get(`api/admin/staffs/${staffSlug}`).then(res => {
            setUserLoadingState(false)
            let staff = res.data.data;
            staff.json = JSON.parse(staff.json);
            setUserInfo({...staff.user ,staff : staff , free_times : (staff.freetimes)});
        }).catch(err => {
            setUserLoadingState(false)
            Toast(Lang.common.connection_error , "danger");
        });
    };


    const getSpecificStaffPackages = (staffSlug) => {
        setPackageLoadingState(true);
        axios.get(`api/admin/staffs/${staffSlug}/packages`).then((res) => {
            setPackages(res.data.data);
            setPackageLoadingState(false);
        }).catch(err => {
            setPackageLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
        });
    };

    const deleteSpecificStaffPackage = (staff_package_id) => {
        setPackageLoadingState(true);
        // TODO 'api/admin/staff-packages/${staff_package_id}' -> deleteSpecificStaffPackage
        axios.delete(`api/admin/staff-packages/${staff_package_id}`)
          .then(res => {
            getSpecificStaffPackages(slug)
            Toast(Lang.common.success, "success");
          })
          .catch(err => {
            setPackageLoadingState(false);
            Toast(Lang.common.connection_error , "danger");
          });
      };
    const deletePackage = (package_id) => {
        deleteSpecificStaffPackage(package_id);
    }

    return (
        <div className={isProfile ? null : classes.root }>
            {slug && !showInfo ? (
                <Calendar 
                    dataUrl={axios.defaults.baseURL + "/api/user/calendar"}
                    postData={{
                        user_id : slug
                    }}
                    onSelectEvent={(event) =>{
                        window.location.href = window.dashboard_url + "/reports/users/" + event.user_id;
                    }}
                    onSelectSlots={(slots) => {
                        setOpen(true);
                        setStart(moment(slots.start).format("YYYY-MM-DD HH:mm"))
                    }}
                />
            ) : null}
            {userLoading ? (
                <Loading />
            ): (
                <UserStaffDetails isEdit={isEdit} isProfile={isProfile} showInfo={showInfo} user_info={user}/>
            )}
            {isProfile && showInfo ? null : (
                <div>
                    {isEdit ? (packageLoading ? (
                        <Loading/>
                    ) : (
                        <StaffPackages packages={packages} isProfile={isProfile} deletePackage={deletePackage} staff_id={slug}/>
                    )) : null}
                </div>
            )}
            <StaffBookDialog openDialog={open} start={start} onClose={() => setOpen(false)} />
        </div>
    );
};


export default withRouter(StaffInfo);
