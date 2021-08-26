export default {
    app_name : "ITICA",
    direction : "rtl",
    profile : {
        title : "پروفایل",
        sub_title : "اطلاعات قابل ویرایش اند",
        login_as_user : "ورود به عنوان این کاربر",
        logout : "خروج از حساب کاربری؟",
        form : {
            name : "نام",
            family : "نام خانوادگی",
            email : "ایمیل",
            birth_date : "تاریخ تولد",
            password : "رمز عبور",
            conf_password : "تایید رمزعبور",
            country : "کشور",
            city : "شهر",
            gender : "جنسیت",
            address : "آدرس",
            phone_number : "شماره تماس",
            skype_id : "آی دی اسکایپ",
            male: "آقا",
            female : "خانم",
            current_gender : "انتخاب شده : ",
            not_selected : "هیچکدام",
            change_password : "تغییر رمز عبور",
            password_changed: "رمزعبور با موفقیت تغییر یافت",
        }
    },
    countries : {
        title : "کتگوری ها",
        add : "افزودن کتگوری",
        packages : "پکیج ها",
        packages_of : "پکیج های ",
        form : {
            title : "کتگوری",
            name : "نام کتگوری"
        },
        list : {
            name : "نام" ,
            options : "گزینه ها",
        }
    },
    packages : {
        title : "پکیج ها",
        add : "افزودن پکیج",
        form : {
            title : "پکیج", 
            name : "نام پکیج" ,
            text : "توضیحات پکیج",
            keywords : "کلمات کلیدی پکیج",
            seo : "سئو ی پکیج",
            countries : "کتگوری ها"
        },
        delete : "آیا مطئنید که میخواهید پاک کنید؟"
    },
    workshop : {
        title : "ورکشاپ ها",
        title_hint : "عنوان باید یکتا باشد",
        new_workshop : "ورکشاپ جدید",
        new_title : "ورکشاپ جدید",
        edit_title : "ویرایش ورکشاپ",
        delete_msg : "آیا می خواهید این ورکشاپ را حذف کنید؟",
        form : {
            title : "عنوان",
            desc : "توضیحات",
            body : "توضیحات کلی",
            select_banner : "انتخاب بنر",
            duration : "زمان" , 
            capacity : "ظرفیت",
            link : "لینک",
            lang : "زبان",
            start_at : "شروع از تاریخ",
            expire_at : "تاریخ اتمام",
            price : "هزینه به دلار" ,
            ir_price : "هزینه به تومان",
            type : "نوع برگذاری",
            type_daily: "روزانه",
            type_weekly: "هفتگی",
            type_biweekly: "هر دو هفته یکبار ",
            select_staff : "انتخاب استاد",
            sessions : "جلسات",
            session_start_time : "زمان شروع جلسه",
            error_required : "لطفا فیلد های ضروری را پر کتید.",
            error_desc : "لطفا فیلد توضیحات را پر کنید",
            error_body : "لطفا فیلد توضیحات کلی را پر کنید",
            error_staff : "استادی انتخاب نشده است",
            error_sessions : "جلسات تعریف نشده اند!",
        },
        list : {
            title : "عنوان",
            staff_name : "نام استاد",
            capacity : "ظرفیت",
            start_at : "شروع در تاریخ",
            created_at : "ایجاد شده در تاریخ"
        }
    },
    users : {
        title : "کاربران",
        add : "افزودن کاربر",
        list : {
            name : "نام" ,
            family : "نام خانوادگی" ,
            email : "ایمیل" ,
            timezone : "محدوده زمانی" ,
            active : "حالت فعال" ,
            birth_date : "تاریخ تولد" ,
            created_at: "ثبت در تاریخ" ,
            info : "اطلاعات",
            booking : "رزرو ها",
        },
        activate : {
            title : "تغییر حالت کاربر",
            msg : " کاربر ?",
            active : "فعال",
            deactive : "غیر فعال"
        },
        state : {
            active : "فعال",
            deactive : "غیر فعال"
        },
        form : {
            name : "نام",
            family : "نام خانوادگی",
            email : "ایمیل",
            password : "رمز عبور",
            birth_date : "تاریخ تولد"
        },
        permissions : {
            title : "اجازه های کاربر",
        },
        staff : {
            no_staff : "این کاربر هنوز استاد نیست!",
            turn : "تبدیل به استاد"
        }
    },
    staffs : {
        title : "استاد ها",
        list : {
            name : "نام" ,
            family : "نام خانوادگی" ,
            email : "ایمیل" ,
            created_at: "ثبت در تاریخ" ,
            info : "اطلاعات",
        },
        delete : "آیا مطمئنید که میخواهید حذف کنید؟",
        form : {
            title : "جزئیات استاد",
            bio : "درباره استاد",
            seo : "سئو",
            suspended : "معلق شده",
            suspended_start : "تاریخ شروع تعلیق",
            suspended_end : "تاریخ اتمام تعلیق",
            active : "فعالسازی",
            free_times : "زمان های خالی استاد",
            day : "روز در هفته",
            start : "زمان شروع" , 
            end : "زمان پایان",
        },
        packages : {
            title : "پکیج های استاد ",
            add : "افزودن پکیج",
            delete : "آیا امطمئنید که میخواهید حذف کنید؟",
            list : {
                package: "پکیج",
                name : "نام" ,
                dur : "مدت" ,
                price : "مبلغ (دلار)" ,
                ir_price: "مبلغ (تومان)" ,
                info : "اطلاعات",
            },
            form : {
                title : "پکیج استاد",
                packages : "پکیج ها",
                list : {
                    select: "انتخاب",
                    package : "پکیج",
                },
                info : "اطلاعات پکیج استاد",
                dur : "مدت - دقیقه" , 
                staff_comission : "کمیسیون استاد",
                price : "هزینه" ,
                ir_price: "هزینه در ایران" ,
                cal_limit : "محدوده تقویم - هفته" ,
                type : "نوع",
                selected : "انتخاب شده : ",
                types : {
                    single : "تکی",
                    weekly : "هفتگی" ,
                    biweekly: "دو هفتگی"
                },
                seo : "سئو",
                active : "فعال",
                can_renew : "قابل تمدید",
            }
        }
    },
    coupon : {
        title : "کد های تخفیف",
        add : "افزودن کد تخفیف",
        delete : "آیا مطمئنید که میخواهید کد تخفیف انتخاب شده را حذف کنید؟",
        list : {
            code: "کد",
            percent : "درصد",
            usage : "استفاده",
            info : "اطلاعات",
            form : {
                title : "اطلاعات کد تخفیف ",
                code: "کد",
                percent : "درصد",
                usage : "استفاده",
                min_schedule  : "حداقل جلسات",
                max_schedule  : "حداکثر جلسات",
                select_user : "انتخاب کاربر",
                select_staff : "انتخاب استاد",
                start_validation : "اعتبار سنجی",
                end_validation : "پایان اعتبار",
                for_user : "برای کاربر",
                for_staff : "برای استاد",
            }
        }
    },
    my_packages : {
        title : "پکیج های من",
        list : {
            package : "پکیج" ,
            instructor : "مدرس",
            dur : "مدت",
            schedules : "تعداد جلسات",
            schedule : "جلسات",
            coupon : "کد تخفیف",
            price : "مبلغ (دلار)",
            ir_price : "مبلغ (تومان)",
            pay_state : "وضعیت پرداخت",
            paid : "پرداخت شده",
            not_paid : "پرداخت نشده",
            date_ordered : "تاریخ سفارش",
            minutes : "دقیقه",
            info : "اطلاعات",
            delete : "حذف",
            timezone : "محدوده زمانی",
            pay : "پرداخت",
            pending : "در انتظار تایید",
            renew : "تمدید"
        },
        package : {
            detail : {
                title : "جزئیات",
            },
            schedules : {
                title : "برنامه پکیج",
                list : {
                    start_student : "زمان شروع (به وقت هنرجو)",
                    start_staff : "زمان شروع (به وقت مدرس)",
                    hold : "برگزار شده",
                    from : "از",
                    minutes : "دقیقه",
                    present_state : "وضعیت حضور",
                    present : "حاضر",
                    absent : "غایب",
                    hold_state : {
                        hold : "برگزار شده",
                        not_hold : "هنوز برگزار نشده"
                    },
                }
            }
        }
    },
    staff_booking : {
        title : "پکیج های استاد",
        list : {
            package : "پکیج",
            name : "نام",
            dur : "مدت",
            price : "هزینه",
            ir_price : "هزینه در ایران",
        },
        reserve : {
            title : "رزرو های پکیج",
            list : {
                customer : "مشتری",
                coupon : "کد تخفیف",
                price : "هزینه",
                ir_price : "هزینه در ایران",
                paid : "پرداخت شده",
                not_paid : "پرداخت نشده",
                info : "اطلاعات",
                date_ordered : "تاریخ سفارش"
            },
            schedules : {
                title : "برنامه ها",
                list : {
                    start : "تاریخ شروع",
                    time : "زمان شروع",
                    hold : "برگزار شده",
                    hold_state : {
                        hold : "برگزار شده",
                        not_hold : "هنوز برگزار نشده"
                    }
                }
            }
        }
    },
    Booking : {
        title : "رزرو",
        add : "رزور کلاس",
        list : {
            title : "انتخاب پکیج",
            instructor : "استاد",
            package : "پکیج",
            duration : "مدت",
            select : "انتخاب"
        },
        package : {
            title : "اطلاعات پیکیج",
            name : "نام پکیج",
            staff : "استاد",
            duration : "مدت زمان",
            form : {
                schedule_date : "تاریخ کلاس ها",
                timezone : "محدوده زمانی",
                coupon : "کد تخفیف",
                schedules_count : "تعداد جلسات",
                submit : "ثبت"
            }
        }
    },
    blog : {
        title : "بلاگ",
        new_post : "پست جدید",
        edit_title : "ویرایش پست",
        new_title : "پست جدید",
        title_hint : "عنوان باید یکتا باشد.",
        form : {
            title : "عنوان",
            category : "دسته بندی",
            is_active : "نمایش پست",
            select_banner : "انتخاب بنر",
            success_update_msg : "پست با موفقیت ویرایش شد.",
            success_new_msg : "پست با موفقیت ثبت شد.",
            body_error_msg : "لطفا متن پست را وارد کنید",
        },
        delete_cat_msg : "آیا از حذف دسته بندی مطمئن هستید؟",
        categories : {
            title : "عنوان",
            category : "دسته بندی",
            categories : "دسته بندی ها",
            reset_form : "بازنشانی فرم",
        },
        list : {
            title :  "عنوان",
            author : "نویسنده",
            created_at : "ایجاد شده در تاریخ",
            category : "دسته بندی",
        }
    },
    renew : {
        title : "تمدید پکیج",
        form : {
            timezone : "محدوده زمانی" ,
            coupon : "کد تخفیف",
            renew : "تمدید"
        }
    },
    messages : {
        title : "پیام ها",
        send : "ارسال",
        message_hint : "پیام شما"
    },
    filter : {
        search : "جست و جو" ,
        column : "ستون" ,
        category : "دسته بندی" ,
        dir : "جهت" ,
        length : "محدودیت تعداد" ,
        filter : "فیلتر"
    },
    dir : {
        asc : "صعودی",
        desc : "نزولی"
    },
    columns : {
        name :"نام",
        title :"عنوان",
        email :"ایمیل",
        capacity :"ظرفیت",
        created_at : "ثبت در تاریخ",
        is_active : "فعال است",
        family : "نام خانوادگی",
        id : "شناسه",
        code : "کد",
        percentage  : "درصد "
    },
    days : {
        SUN : "یکشنبه",
        Sunday : "یکشنبه",
        MON : "دوشنبه",
        Monday : "دوشنبه",
        TUE : "سه شنبه",
        Tuesday : "سه شنبه",
        WED : "چهارشنبه",
        Wednesday : "چهارشنبه",
        THU : "پنجشنبه",
        Thursday : "پنجشنبه",
        FRI : "جمعه",
        Friday : "جمعه",
        SAT : "شنبه",
        Saturday : "شنبه",
    },
    common : {
        home : "صفحه اصلی",
        add : "افزودن",
        save : "ذخیره",
        cancel : "لغو",
        yes : "بله",
        delete : "حذف",
        edit : "ویرایش",
        warning : "هشدار!",
        upload_pic : "آپلود تصویر",
        delete_msg : "آیا می خواهید حذف کنید؟",
        logout : "خروج از حساب",
        change : "تغییر",
        connection_error : "خطا در اتصال!",
    }
};