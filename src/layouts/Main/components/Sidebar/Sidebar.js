import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CountriesIcon from '@material-ui/icons/Map';
import BlogIcon from '@material-ui/icons/PostAdd';
import PackagesIcon from '@material-ui/icons/Category';
import PeopleIcon from '@material-ui/icons/People';
import StaffsIcon from '@material-ui/icons/VerifiedUser';
import CouponsIcon from '@material-ui/icons/MoneyOff';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TableIcon from '@material-ui/icons/TableChart';
import WorkshopIcon from '@material-ui/icons/Camera';
import TalkIcon from '@material-ui/icons/ChatBubble';
import ReportsIcon from '@material-ui/icons/BarChart';
import InputIcon from '@material-ui/icons/Input';
import PagesIcon from '@material-ui/icons/Mail';
import MoneyIcon from '@material-ui/icons/MoneyRounded';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';

import { Profile, SidebarNav } from './components';
import Lang from "../../../../Language";
import axios from "axios";
import config from "../../../../website.config";


const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: Lang.common.home,
      href: config.siteURL,
      icon: <HomeIcon />,
      full: true
    },
    {
      title: Lang.dashboard.title,
      href: '/',
      endswith : true,
      icon: <DashboardIcon />,
    },
    {
      title: Lang.profile.title,
      href: '/account',
      icon: <PersonIcon />,
    },
    {
      title: Lang.blog.title,
      href: '/blog',
      icon: <BlogIcon />,
      permission : "post-manage",
      check: "blog",
      childs : [
        {
          title: Lang.blog.posts,
          href: '/',
          endswith : true,
          permission : "post-manage",
        },
        {
          title: Lang.blog.new_post,
          href: '/new',
          permission : "post-manage",
        },
        {
          title: Lang.blog.categories.categories,
          href: '/cats',
          permission : "post-manage",
        },
      ]
    },
    {
      title: Lang.users.title,
      href: '/users',
      icon: <PersonIcon/>,
      hide_role : ["staff"],
      permission : "user-manage",
      childs : [
        {
          title: Lang.users.user_list,
          href: '/',
          permission : "user-manage",
          endswith : true,
        },
        {
          title: Lang.users.add,
          href: '/new',
          permission : "user-manage",
        },
        {
          title: Lang.roles.title,
          href: '/roles',
          permission : "user-manage",
        },
      ]
    },
    {
      title: Lang.workshop.title,
      href: '/workshops',
      icon: <WorkshopIcon />,
      permission : "workshop-manage",
      hide_role : ["staff"],
      check: "workshops",
      childs : [
        {
          title: Lang.workshop.workshops_list,
          href: '/',
          permission : "workshop-manage",
          endswith : true,
        },
        {
          title: Lang.workshop.new_workshop,
          href: '/new',
          permission : "workshop-manage",
        },
      ]
    },
    {
      title: Lang.messages.title,
      href: '/messaging',
      icon: <TalkIcon />,
      check: "messaging",
      hide : ["user-manage"]
    },
    {
      title: Lang.reports.title,
      href: '/reports',
      icon: <ReportsIcon />,
      permission : "report-manage",
      childs : [
        {
          title: Lang.reports.finantial,
          href: '/financial',
          icon: <MoneyIcon />,
          permission : "report-manage"
        },
        {
          title: Lang.users.title,
          href: '/users',
          icon: <PeopleIcon />,
          permission : "user-manage"
        },
      ]
    },
    {
      title: Lang.packages.title,
      href: '/packages',
      icon: <PackagesIcon />,
      hide_role : ["staff"],
      permission : "package-manage",
      childs : [
        {
          title: Lang.packages.list_title,
          href: '/',
          permission : "package-manage",
          endswith : true
        },
        {
          title: Lang.countries.title,
          href: '/countries',
          permission : "country-manage",
        },
      ]
    },
    {
      title: Lang.staffs.title,
      href: '/staffs',
      icon: <StaffsIcon />,
      hide_role : ["staff"],
      permission : "staff-manage",
      childs : [
        {
          title: Lang.staffs.list_title,
          href: '/',
          permission : "staff-manage",
          endswith : true
        },
        {
          title: Lang.staffs.new,
          href: '/new',
          permission : "staff-manage",
        }
      ]
    },
    {
      title: Lang.coupon.title,
      href: '/coupons',
      icon: <CouponsIcon />,
      hide_role : ["staff"],
      permission : "coupon-manage",
      childs : [
        {
          title: Lang.coupon.coupon_list,
          href: '/',
          permission : "coupon-manage",
          endswith : true,
        },
        {
          title: Lang.coupon.add,
          href: '/new',
          permission : "coupon-manage",
        },
      ]
    },
    {
      title: Lang.my_packages.title,
      href: '/mypackages',
      icon: <ShoppingBasketIcon />,
      hide : ["user-manage"],
      hide_role : ["staff"]
    },
    {
      title: Lang.my_workshops.title,
      href: '/myworkshops',
      icon: <WorkshopIcon />,
      hide : ["user-manage"],
      hide_role : ["staff"]
    },
    // {
    //   title: Lang.calendar.title,
    //   href: '/calendar',
    //   icon: <TableIcon />,
    //   hide : ["user-manage"],
    //   hide_role : ["staff"]
    // },
    {
      title: Lang.staff_booking.title,
      href: '/staffBooking',
      icon: <TableIcon />,
      role : "staff",
    },
    {
      title: "Settings",
      href: '/settings',
      icon: <SettingsIcon />,
      permission : "site-manage",
      childs : [
        {
          title: "Site Settings",
          href: '/',
          permission : "site-manage",
          endswith : true
        },
        {
          title: Lang.templates.title,
          href: '/templates',
          permission : "template-manage",
        },
      ]
    },
    {
      title: Lang.common.logout,
      href: '/log-out',
      icon: <InputIcon />
    },
  ];

  return (
    <Drawer
      anchor={Lang.direction == "rtl" ? "right" : "left"}
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
