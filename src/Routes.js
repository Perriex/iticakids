import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout , Minimal as MinimalLayout } from './layouts';

import {
  ProductList as ProductListView,
  StaffList as StaffListView,
  UserList as UserListView,
  UserInfo as UserInfoView,
  newUser as NewUserView,
  UserBooking as UserBookingView,
  UserBookingInfo as UserBookingInfoView,
  NewBooking as NewBookingView,
  BookPackage as BookPackageView,
  StaffInfo as StaffInfoView,
  Account as AccountView,
  AddStaffPackage as AddStaffPackageView,
  EditStaffPackage as EditStaffPackageView,
  NotFound as NotFoundView,
  Countries as CountriesView,
  CouponList as CouponListView,
  CouponInfo as CouponInfoView,
  PackageList as PackageListView,
  MyPackages as MyPackagesView,
  MyWorkshops as MyWorkshopsView,
  MyWorkshopInfo as MyWorkshopInfoView,
  RenewPackage as RenewPackageView,
  MyPackageInfo as MyPackageInfoView,
  StaffBookings as StaffBookingsView,
  PackageReserves as PackageReservesView,
  ResreveInfo as ResreveInfoView,
  Blog as BlogView,
  NewBlog as NewBlogView,
  BlogCategories as BlogCategoriesView,
  Logout as LogoutView,
  Workshop as WorkshopView,
  WorkshopReserves as WorkshopReservesView,
  WorkshopReserve as WorkshopReserveView,
  Messaging as MessagingView,
  WorkshopInfo as WorkshopInfoView,
  FinancialReports as FinancialReportsView,
  Invoices as InvoicesView,
  InvoiceInfo as InvoiceInfoView,
  StaffInvoices as StaffInvoicesView,
  FinancialStaffReports as FinancialStaffReportsView,
  Templates as TemplatesView,
  TemplatesInfo as TemplatesInfoView,
  UsersReports as UsersReportsView,
  SiteSettings as SiteSettingsView,
  Calendar as CalendarView,
  UserCalendar as UserCalendarView,
  Dashboard as DashboardView,
  Roles as RolesView,
  Users as UsersView,
  StaffGrid as StaffGridView
} from './views';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import AdminPackageReserves from './views/StaffBookings/components/AdminPackageReserves';
// const MainLayout = React.lazy(() => import('./layouts/Main'));
// const UserListView = React.lazy(() => import('./views/UserList'));
// const StaffListView = React.lazy(() => import('./views/StaffList'));
// const UserInfoView = React.lazy(() => import('./views/UserList/components/UserInfo'));
// const UserBookingView = React.lazy(() => import('./views/UserList/components/UserBooking'));
// const UserBookingInfoView = React.lazy(() => import('./views/UserList/components/UserBookingInfo'));
// const NewBookingView = React.lazy(() => import('./views/UserList/components/UserBooking/components/NewBooking'));
// const BookPackageView = React.lazy(() => import('./views/UserList/components/UserBooking/components/BookPackage'));
// const StaffInfoView = React.lazy(() => import('./views/StaffList/components/StaffInfo'));
// const AccountView = React.lazy(() => import('./views/Countries'));
// const AddStaffPackageView = React.lazy(() => import('./views/StaffList/components/AddStaffPackage'));
// const EditStaffPackageView = React.lazy(() => import('./views/StaffList/components/EditStaffPackage'));
// const NotFoundView = React.lazy(() => import('./views/NotFound'));
// const CountriesView = React.lazy(() => import('./views/Countries'));
// const CouponListView = React.lazy(() => import('./views/CouponList'));
// const CouponInfoView = React.lazy(() => import('./views/CouponList/components/CouponInfo'));
// const PackageListView = React.lazy(() => import('./views/PackageList'));
// const MyPackagesView = React.lazy(() => import('./views/MyPackages'));
// const RenewPackageView = React.lazy(() => import('./views/MyPackages/components/RenewPackage'));
// const MyPackageInfoView = React.lazy(() => import('./views/MyPackages/components/MyPackageInfo'));
// const StaffBookingsView = React.lazy(() => import('./views/StaffBookings'));
// const PackageReservesView = React.lazy(() => import('./views/StaffBookings/components/PackageReserves'));
// const ResreveInfoView = React.lazy(() => import('./views/StaffBookings/components/ResreveInfo'));
// const BlogView = React.lazy(() => import('./views/Blog'));
// const NewBlogView = React.lazy(() => import('./views/Blog/posts/components/PostInfo'));
// const BlogCategoriesView = React.lazy(() => import('./views/Blog/posts/components/Categories'));
// const LogoutView = React.lazy(() => import('./views/Logout'));
// const WorkshopView = React.lazy(() => import('./views/Workshop'));
// const WorkshopInfoView = React.lazy(() => import('./views/Workshop/components/WorkshopInfo'));

const Routes = (props) => {
  return (
    <Switch>
    {/* <Redirect to={ window.dashboard_url + "/not-found"} /> */}
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path={ window.dashboard_url}
        auth={true}
      />
      <Redirect
        exact
        from={window.dashboard_url + "/reports"}
        to={ window.dashboard_url + "/reports/financial"}
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path={ window.dashboard_url + "/account"}
        auth={true}
      />
      <RouteWithLayout
        component={CountriesView}
        exact
        layout={MainLayout}
        permission={"country-manage"}
        path={ window.dashboard_url + "/packages/countries"}
        auth={true}
      />
      <RouteWithLayout
        component={PackageListView}
        exact
        layout={MainLayout}
        permission={"package-manage"}
        path={ window.dashboard_url + "/packages"}
        auth={true}
      />

      <RouteWithLayout
        component={StaffGridView}
        exact
        layout={MainLayout}
        permission={"staff-manage"}
        auth={true}
        path={ window.dashboard_url + "/staffs"}
      />
      <RouteWithLayout
        component={StaffInfoView}
        exact
        layout={MainLayout}
        permission={"staff-manage"}
        auth={true}
        path={ window.dashboard_url + "/staffs/new"}
      />
      <RouteWithLayout
        component={StaffInfoView}
        exact
        layout={MainLayout}
        permission={"staff-manage"}
        auth={true}
        path={ window.dashboard_url + "/staffs/:staff_id"}
      />
      <RouteWithLayout
        component={AddStaffPackageView}
        exact
        layout={MainLayout}
        permission={"staff-manage"}
        auth={true}
        path={ window.dashboard_url + "/staffs/:staff_id/new"}
      />
      <RouteWithLayout
        component={EditStaffPackageView}
        exact
        layout={MainLayout}
        permission={"staff-manage"}
        auth={true}
        path={ window.dashboard_url + "/staffs/:staff_id/package/:package_id"}
      />
      <RouteWithLayout
        component={CouponListView}
        exact
        layout={MainLayout}
        auth={true}
        permission={"coupon-manage"}
        path={ window.dashboard_url + "/coupons"}
      />
      <RouteWithLayout
        component={CouponInfoView}
        exact
        layout={MainLayout}
        auth={true}
        permission={"coupon-manage"}
        path={ window.dashboard_url + "/coupons/:coupon_id"}
      />
      <RouteWithLayout
        component={CouponInfoView}
        exact
        layout={MainLayout}
        auth={true}
        permission={"coupon-manage"}
        path={ window.dashboard_url + "/coupons/new"}
      />
      <RouteWithLayout
        component={MyWorkshopsView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/myworkshops"}
      />
      <RouteWithLayout
        component={MyWorkshopInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/myworkshops/:reserve_id"}
      />
      <RouteWithLayout
        component={CalendarView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/calendar"}
      />
      <RouteWithLayout
        component={MyPackagesView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/mypackages"}
      />
      <RouteWithLayout
        component={RenewPackageView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/mypackages/renew/:reserve_id"}
      />
      <RouteWithLayout
        component={MyPackageInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/mypackages/:reserve_id"}
      />
      <RouteWithLayout
        component={StaffInvoicesView}
        exact
        layout={MainLayout}
        auth={true}
        role={"staff"}
        path={ window.dashboard_url + "/invoices"}
      />
      <RouteWithLayout
        component={InvoiceInfoView}
        exact
        layout={MainLayout}
        auth={true}
        role={"staff"}
        path={ window.dashboard_url + "/invoices/:invoice_id"}
      />
      <RouteWithLayout
        component={StaffBookingsView}
        exact
        layout={MainLayout}
        auth={true}
        role={"staff"}
        path={ window.dashboard_url + "/staffBooking"}
      />
      <RouteWithLayout
        component={PackageReservesView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/staffBooking/:package_id"}
      />
       <RouteWithLayout
        component={AdminPackageReserves}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/staff/:staff_id/staffBooking/:package_id"}
      />
      <RouteWithLayout
        component={ResreveInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/staffBooking/:package_id/reserve/:reserve_id"}
      />

      <RouteWithLayout
        component={ResreveInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/staff/:staff_id/staffBooking/:package_id/reserve/:reserve_id"}
      />
      <RouteWithLayout
        component={BlogView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/blog"}
      />
      <RouteWithLayout
        component={BlogCategoriesView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/blog/cats"}
      />
      <RouteWithLayout
        component={NewBlogView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/blog/new"}
      />
      <RouteWithLayout
        component={NewBlogView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/blog/:blog_slug"}
      />
      <RouteWithLayout
        component={WorkshopView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/workshops"}
      />
      <RouteWithLayout
        component={WorkshopInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/workshops/new"}
      />
      <RouteWithLayout
        component={WorkshopInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/workshops/:workshop_slug"}
      />
      <RouteWithLayout
        component={WorkshopReservesView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/workshops/:workshop_slug/reserves"}
      />
      <RouteWithLayout
        component={WorkshopReserveView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/workshops/:workshop_slug/reserves/new"}
      />
      <RouteWithLayout
        component={MessagingView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/messaging"}
      />
      <RouteWithLayout
        component={FinancialReportsView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/financial"}
      />
      <RouteWithLayout
        component={FinancialStaffReportsView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/financial/classes/:staff_id"}
      />
      <RouteWithLayout
        component={InvoiceInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/financial/invoices/:staff_id/:type/new"}
      />
      <RouteWithLayout
        component={InvoiceInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/financial/invoices/:staff_id/:type/:invoice_id"}
      />
      <RouteWithLayout
        component={InvoicesView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/reports/financial/invoices/:staff_id/:type"}
      />
      <RouteWithLayout
        component={RolesView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/users/roles"}
      />
      <RouteWithLayout
        component={UsersView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/users"}
      />
      <RouteWithLayout
        component={NewUserView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/users/new"}
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users"}
      />
      <RouteWithLayout
        component={UserInfoView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users/:user_id"}
      />
      <RouteWithLayout
        component={UserBookingView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users/:user_id/booking"}
      />
      <RouteWithLayout
        component={UserCalendarView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users/:user_id/calendar"}
      />
      <RouteWithLayout
        component={NewBookingView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users/:user_id/booking/new"}
      />
      <RouteWithLayout
        component={BookPackageView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users/:user_id/booking/new/:staff_slug/:package_id"}
      />
      <RouteWithLayout
        component={UserBookingInfoView}
        exact
        layout={MainLayout}
        permission={"user-manage"}
        auth={true}
        path={ window.dashboard_url + "/reports/users/:user_id/booking/:reserve_id"}
      />
      <RouteWithLayout
        component={TemplatesView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/settings/templates"}
      />
      <RouteWithLayout
        component={TemplatesInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/settings/templates/new"}
      />
      <RouteWithLayout
        component={TemplatesInfoView}
        exact
        layout={MainLayout}
        auth={true}
        path={ window.dashboard_url + "/settings/templates/:id"}
      />
      <RouteWithLayout
        component={SiteSettingsView}
        exact
        layout={MainLayout}
        permission={"site-manage"}
        auth={true}
        path={ window.dashboard_url + "/settings"}
      />
      {/* <RouteWithLayout
        component={SignUp}
        exact
        layout={MinimalLayout}
        noauth={true}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignIn}
        exact
        layout={MinimalLayout}
        noauth={true}
        path="/sign-in"
      /> */}
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path={ window.dashboard_url + "/not-found"}
      />
      <RouteWithLayout
        component={LogoutView}
        exact
        layout={MinimalLayout}
        auth={true}
        path={ window.dashboard_url + "/log-out"}
      />
      { props.children }
    </Switch>
  );
};

export default Routes;
