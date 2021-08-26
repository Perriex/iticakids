export default {
    app_name : "ITICA",
    direction : "ltr",
    dashboard : {
        title : "Dashboard"
    },
    profile : {
        title : "Profile",
        sub_title : "The information can be edited",
        login_as_user : "Login as this user",
        logout : "Logout Account?",
        form : {
            name : "First Name",
            family : "Last Name",
            email : "Email Address",
            birth_date : "Birth Date",
            password : "Password",
            conf_password : "Confirm Password",
            country : "Country",
            city : "City",
            gender : "Gender",
            address : "Address",
            phone_number : "Phone number",
            skype_id : "Skype id",
            male: "Male",
            female : "Female",
            current_gender : "Current Selected : ",
            not_selected : "Not Selected yet",
            change_password : "change password",
            password_changed: "password changed successfully",
        }
    },
    countries : {
        title : "Categories",
        add : "Add Category",
        packages : "Packages",
        packages_of : "Packages Of ",
        form : {
            title : "Category",
            name : "Category name"
        },
        list : {
            name : "name" ,
            options : "options",
        }
    },
    packages : {
        title : "Packages",
        list_title : "Packages List",
        add : "Add Package",
        form : {
            title : "Package",
            name : "Package Name" ,
            text : "Package Description",
            keywords : "Package Keywords",
            language:"Package language",
            age:"Package age",
            seo : "Package Seo",
            countries : "Categories"
        },
        delete : "Are you sure to Delete ?"
    },
    workshop : {
        title : "Workshops",
        title_hint : "title should be unique",
        new_workshop : "New Workshop",
        new_title : "New Workshop",
        workshops_list : "Workshop List",
        edit_title : "Edit Workshop",
        delete_msg : "Do you want to delete this workshop?",
        form : {
            title : "title",
            desc : "Description",
            body : "Body",
            select_banner : "Select Banner",
            duration : "Duration" ,
            capacity : "Capacity",
            link : "Link",
            lang : "Language",
            age : "Age",
            start_at : "Start At",
            expire_at : "Expire At",
            price : "Price" ,
            staff_commission : "Staff Commission" ,
            ir_price : "IR Price",
            type : "Type",
            type_daily: "Daily",
            type_weekly: "Weekly",
            type_biweekly: "Biweekly",
            select_staff : "Select Staff",
            sessions : "Sessions",
            session_start_time : "Session Start Time",
            error_required : "Please Fill Required Fields",
            error_desc : "Please Fill Description Field",
            error_body : "Please Fill Body Field",
            error_staff : "staff not selected",
            error_sessions : "sessions not defined",
        },
        list : {
            title : "Title",
            staff_name : "Staff name",
            capacity : "Capacity",
            start_at : "Start At",
            created_at : "Created at",
            reserves : "Reserves",
        },
        reserves : {
            list : {
                workshop : "workshop",
                user : "user",
                duration : "duration",
                sessions : "sessions",
                coupon : "coupon",
                price : "price",
                order_date : "order date",
                pay_state : "payment state",
                reserve : "reserve",
            }
        },
        reserve : {
            user_not_selected : "User Not Selected Yet!",
            timezone : "Timezone" ,
            coupon : "Coupon",
            error_user : "Please Select User",
            error_timezone : "Please Select Timezone",
        }
    },
    reports : {
        title : "Reports",
        finantial : "Finantial",
        type : {
            workshops : "Workshops",
            packages : "Packages"
        },
        toolbar : {
            date_range : "Date Range",
            timezone : "timezone" ,
            search : "Search" ,
            filter : "Filter",
        },
        list : {
            staff : "Staff",
            irt_income : "IRT Income",
            irt_site_income : "IRT Site Income",
            usd_income : "USD Income",
            usd_site_income : "USD Site Income",
            hours : "Hours",
            pending_hours : "Pending Hours",
            students : "Students" ,
            reserves : "Reserves",
            invoices : "Invoices",
            selected : "Selected"
        },
        overview : {
            hours : "Hours",
            holded : "Holded",
            pending : "Pending",
            income : "Income",
            site : "Site",
            staffs : "staffs",
            usd : "USD",
            irt : "IRT",
            students : "Students",
            total : "Total"
        },
        reserves : {
            toolbar : {
                date_range : "Date Range",
                timezone : "Timezone",
                search : "Search",
                duration : "Duration",
                package : "Package",
                filter : "Filter"
            },
            list : {
                user : "user",
                package : "package",
                duration : "duration",
                price : "price",
                coupon : "coupon",
                off_percent : "off percent",
                staff_income : "staff income",
                site_income : "site income",
                currency : "currency",
                timezone : "timezone",
                paid_at : "paid at"
            },
            sessions : {
                title : "Sessions",
                date : "date",
                student_date : "Student Date",
                index: "Session Index",
                is_last : "Is Last Session",
                true : "True",
                false : "False",
                hold : "Hold",
                user_state : "User State",
            }
        },
        invoices : {
            no_invoice : "Invoice List Is Empty",
            new_invoice : "New Invoice",
            list : {
                start_date : "Start Date",
                end_date : "End Date",
                info : "info"
            },
            form : {
                date_range : "Date Range",
                filter : "Filter",
                staff : "Staff",
                irt_income : "IRT Income",
                irt_site_income : "IRT Site Income",
                usd_income : "USD Income",
                usd_site_income : "USD Site Income",
                hours : "Hours",
                pending_hours : "Pending Hours",
                students : "Students" ,
                total_staff_income : "Total Staff Income",
                extra_bills : "Extra Bills",
                upload : "Upload Receipt",
                usd : "USD",
                irt : "IRT",
                title : "title",
                amount : "amount",
                currency : "currency",
                usd_to_irt : "USD To IRT",
                usd_to_irt_error : "Please set USD To IRT",
                total : "total",
                to_usd : "to USD",
                to_IRT : "to IRT",
                des : "Description",
                calculate : "Calculate",
            }
        }
    },
    roles : {
        title : "Roles"
    },
    users : {
        title : "Users",
        add : "Add User",
        send_msg : "Send Message",
        user_list : "User List",
        list : {
            name : "Name" ,
            family : "Family" ,
            email : "Email" ,
            timezone : "Timezone" ,
            active : "Active State" ,
            country : "Country" ,
            birth_date : "Birth Date" ,
            starred : "Starred",
            created_at: "Joined At" ,
            info : "info",
            calendar : "calendar",
            booking : "booking",
            star_msg : "Change User's Starred State?"
        },
        activate : {
            title : "Change User State",
            msg : " user ?",
            active : "Active",
            deactive : "Deactive"
        },
        state : {
            active : "Active",
            deactive : "Deactive"
        },
        form : {
            name : "First Name",
            family : "Last Name",
            email : "Email Address",
            password : "Password",
            birth_date : "Birth Date"
        },
        permissions : {
            title : "User Permission",
        },
        staff : {
            no_staff : "User is not a staff yet!",
            turn : "turn to a staff"
        }
    },
    templates : {
        title : "Templates",
        new : "New Template",
        list : {
            title: "Title",
            created_at : "Created at",
            info : "Info",
            delete : "Delete",
            send : "Send",
            is_default : "Is Default",
            send_msg : "Send Message to starred users?",
        },
        form : {
            title : "Title",
            error_title : "Please Fill Title Field" ,
            error_body : "Please Fill Body of template",
            is_default : "set as default template",
            default_hint : "Add [content] to your email to define main content's place"
        }
    },
    staffs : {
        title : "Staffs",
        list_title : "Staffs list",
        new : "New Staff",
        list : {
            name : "Name" ,
            family : "Family" ,
            email : "Email" ,
            created_at: "Joined At" ,
            info : "info",
        },
        delete : "Are you sure to Delete ?",
        form : {
            title : "Staff Details",
            bio : "biograph",
            is_group_class:"is Group Class?",
            programTaught:"Program Taught",
            ageGroup:"age group",
            TeachSince:"teach since",
            LanguagesSpoken:"Languages Spoken",
            seo : "seo",
            suspended : "suspended",
            suspended_start : "suspended start date",
            suspended_end : "suspended end date",
            active : "active",
            free_times : "Staff Free Times",
            day : "Day In Week",
            start : "Start Time" ,
            end : "End Time",
        },
        packages : {
            title : "Staff's Packages ",
            add : "Add Package",
            delete : "Are You sure to delete ?",
            list : {
                package: "Package",
                name : "Name" ,
                category : "Category" ,
                dur : "duration" ,
                price : "Price USD" ,
                ir_price: "Price IRT" ,
                info : "info",
            },
            form : {
                title : "Staff Package",
                packages : "Packages",
                list : {
                    select: "select",
                    package : "Package",
                },
                info : "Staff Package Info",
                dur : "duration - minute" ,
                staff_comission : "Staff Comission",
                price : "price" ,
                ir_price: "IR price" ,
                cal_limit : "Calendar Limit - week" ,
                type : "type",
                selected : "selected : ",
                types : {
                    single : "single",
                    weekly : "weekly" ,
                    biweekly: "biweekly"
                },
                seo : "Seo",
                active : "active",
                can_renew : "can_renew",
            }
        }
    },
    coupon : {
        title : "Coupons",
        add : "Add Coupon",
        coupon_list : "List",
        delete : "Are You sure to delete Selected Coupon?",
        list : {
            code: "code",
            percent : "percent",
            usage : "usage",
            info : "info",
            form : {
                title : "Coupon's Info ",
                code: "code",
                percent : "percent",
                usage : "usage",
                min_schedule  : "min Schedule",
                max_schedule  : "max Schedule",
                select_user : "Select User",
                select_staff : "Select Staff",
                start_validation : "Start Validation",
                end_validation : "End Validation",
                for_user : "For User",
                for_staff : "For Staff",
            }
        }
    },
    my_workshops : {
        title : "My Workshops",
    },
    calendar : {
        title : "Calendar",
    },
    my_packages : {
        title : "MyPackages",
        list : {
            package : "Package" ,
            instructor : "Instructor",
            dur : "Duration",
            schedule : "schedule",
            coupon : "Coupon",
            schedules : "schedules count",
            price : "Price",
            ir_price : "Price IRT",
            paid : "Paid",
            pay_state : "Pay state",
            not_paid : "Not Paid",
            date_ordered : "Date Ordered",
            minutes : "Minutes",
            info : "info",
            delete : "delete",
            timezone : "timezone",
            pay : "go to paypal",
            pending : "pending",
            renew : "renew"
        },
        package : {
            detail : {
                title : "Details",
            },
            schedules : {
                title : "Package's Schedules",
                reschedule : "Reschedule ",
                reschedule_msg : "You only can reschedule one class per month!",
                new_schedule : "New Schedule ",
                false : "False" ,
                true : "True",
                list : {
                    start_student : "Star date (student)",
                    start_staff : "Star date (staff)",
                    hold : "hold",
                    reschedule : "Reschedule ",
                    hold_for_user : "hold For User",
                    from : "from",
                    present_state : "present state",
                    present : "present",
                    absent : "absent",
                    minutes : "minutes",
                    hold_state : {
                        hold : "Hold",
                        not_hold : "Not Hold Yet"
                    }
                }
            }
        }
    },
    staff_booking : {
        title : "Staff's Packages",
        list : {
            package : "package",
            name : "name",
            dur : "duration",
            price : "price",
            ir_price : "IR price",
        },
        toolbar : {
            search : "Search",
            category : "Category",
            duration : "Duration",
            invoices : "Invoices"
        },
        reserve : {
            title : "Package's Resreves",
            list : {
                customer : "customer",
                coupon : "Coupon",
                price : "Price",
                ir_price : "IR Price",
                paid : "Paid",
                not_paid : "Not Paid",
                info : "Info",
                date_ordered : "Date Ordered"
            },
            schedules : {
                title : "Schedules",
                list : {
                    start : "Star Date",
                    time : "Start Time",
                    hold : "hold",
                    need_reschedule : "need reschedule",
                    reschedule_requested : "reschedule requested",
                    hold : "hold",
                    hold_state : {
                        hold : "Hold",
                        not_hold : "Not Hold Yet"
                    }
                }
            }
        }
    },
    Booking : {
        title : "booking",
        add : "book",
        list : {
            title : "select Package",
            instructor : "instructor",
            package : "package",
            duration : "duration",
            select : "select"
        },
        package : {
            title : "Package Info",
            name : "Package name",
            staff : "Staff",
            duration : "Duration",
            form : {
                schedule_date : "Schedule_date",
                timezone : "Timezone",
                coupon : "Coupon",
                schedules_count : "Scedules Count",
                submit : "submit"
            }
        }
    },
    blog : {
        title : "Blog",
        posts : "Posts",
        new_post : "New Post",
        edit_title : "Edit Post",
        new_title : "New Post",
        title_hint : "title should be unique!",
        form : {
            title : "Title",
            category : "Category",
            is_active : "Show Post",
            select_banner : "Select banner",
            success_update_msg : "Post updated successfully",
            success_new_msg : "Post created successfully",
            body_error_msg : "Fill Body Text Field",
        },
        delete_cat_msg : "Are you sure to delete this category",
        categories : {
            title : "Title",
            category : "Category",
            categories : "Categories",
            reset_form : "Reset Form",
        },
        list : {
            title : "Title",
            author : "Author",
            created_at : "Created At",
            category : "Category",
        }
    },
    renew : {
        title : "Renew Package",
        form : {
            timezone : "Timezone" ,
            coupon : "Coupon",
            renew : "Renew"
        }
    },
    messages : {
        title : "Messages",
        send : "send",
        message_hint : "Your Message"
    },
    filter : {
        search : "Search" ,
        column : "Column" ,
        category : "Category" ,
        dir : "Direction" ,
        length : "Number Limit" ,
        filter : "filter"
    },
    dir : {
        asc : "Ascending",
        desc : "Descending"
    },
    columns : {
        name :"name",
        title :"title",
        email :"email",
        capacity : "capacity",
        created_at : "created at",
        is_active : "is_active",
        family : "family",
        timezone : "timezone",
        country : "country",
        id : "id",
        code : "code",
        percentage  : "percentage "
    },
    days : {
        SUN : "Sunday",
        Sunday : "Sunday",
        MON : "Monday",
        Monday : "Monday",
        TUE : "Tuesday",
        Tuesday : "Tuesday",
        WED : "Wednesday",
        Wednesday : "Wednesday",
        THU : "Thursday",
        Thursday : "Thursday",
        FRI : "Friday",
        Friday : "Friday",
        SAT : "Saturday",
        Saturday : "Saturday",
    },
    common : {
        home : "Home",
        add : "ADD",
        ok : "ok",
        save : "SAVE",
        cancel : "CANCEL",
        minutes : "Minutes",
        yes : "Yes",
        delete : "delete",
        edit : "Edit",
        warning : "Warning!",
        upload_pic : "Upload Picture",
        remove_pic : "Remove Picture",
        delete_msg : "Are you sure to delete?",
        logout : "Logout",
        change : "change",
        connection_error : "Connection Error!",
        input_error : "Input parameters is not valid!",
        success : "Operation Done Successfully",
        delete_msg : "are you sure to delete?",
    }
};
