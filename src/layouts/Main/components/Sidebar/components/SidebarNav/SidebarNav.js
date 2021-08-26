/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, Fragment, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  List,
  ListItem,
  Button,
  colors,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Link,
} from '@material-ui/core';

import store from "store";
import Lang from "../../../../../../Language";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    direction: Lang.direction,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  link_icon:{
    paddingLeft : "24px",
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;
  const [openChilds, setOpenChilds] = useState([]);
  const classes = useStyles();
  React.useEffect(() => {
    if (pages) {
      let _open_childs = [...openChilds];
      pages.forEach((page, i) => {
        let counter = 0;
        if (page.childs) {
          page.childs.forEach((k) => {
            counter += (checkSelectedPage({ ...k, href: page.href + k.href }) ? 1 : 0);
          })

        }
        _open_childs[i] = page.childs ? !!counter : null;
      });
      setOpenChilds([..._open_childs]);
    }
  }, [pages])

  const user = store.get("user");

  const checkPermission = (permission) => {
    if (!permission) {
      return true;
    }
    return user.permissions.find(k => k.slug == permission)
  }

  const checkMenu = (check) => {
    if (!check) {
      return true;
    }
    let menus = user.site.site_settings.find(k => k.slug == "menus");
    if (!menus) return false;
    menus = JSON.parse(menus.value);
    return menus.includes(check);
  }


  const hideFor = (permissions) => {
    if (!permissions) return true
    let hide = false;

    permissions.forEach(access => {
      hide = hide || checkPermission(access);
    });
    return !hide;
  }

  const hideForRole = (roles) => {
    if (!roles) return true
    let hide = false;

    roles.forEach(access => {
      hide = hide || checkRole(access);
    });

    return !hide;
  }


  const checkRole = (role) => {
    if (!role) {
      return true;
    }
    return user.roles.find(k => k.slug == role)

  }

  const checkSelectedPage = (page) => {
    if (page.endswith) {
      return props.history.location.pathname.endsWith(window.dashboard_url + page.href);
    } else {
      return props.history.location.pathname.includes(window.dashboard_url + page.href);
    }
  }

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map((page, i) => {
        if (!checkPermission(page.permission)) return null;
        if (!checkRole(page.role)) return null;
        if (!checkMenu(page.check)) return null;
        if (!hideFor(page.hide)) return null;
        if (!hideForRole(page.hide_role)) return null;
        let hasChilds = !!page.childs;
        return (
          <Fragment>
            {page.full ? (
              <Link
                href={page.href}
              >
                <ListItem
                  className={classes.item}
                  disableGutters
                  key={page.title}
                  selected={checkSelectedPage(page)}
                >
                  <ListItemText primary={page.title} />
                  <ListItemIcon className={classes.link_icon}>
                    {page.icon}
                  </ListItemIcon>
                </ListItem>
              </Link>
            ) : (
                <ListItem
                  className={classes.item}
                  disableGutters
                  key={page.title}
                  selected={checkSelectedPage(page)}
                >
                  <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={hasChilds ? 'button' : CustomRouterLink}
                    to={page.full ? page.href : window.dashboard_url + page.href}
                    onClick={hasChilds ? () => {
                      let _open_childs = [...openChilds];
                      _open_childs[i] = !_open_childs[i];
                      setOpenChilds([..._open_childs]);
                    } : null}
                  >
                    <ListItemIcon>
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText primary={page.title} />
                    {openChilds[i] == null ? null : (openChilds[i] ? <ExpandLess /> : <ExpandMore />)}
                  </Button>
                </ListItem>
              )}

            { openChilds[i] == null ? null : (
              <Collapse in={openChilds[i]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {page.childs.map((child, j) => {
                    return (
                      <ListItem
                        className={classes.nested}
                        disableGutters
                        key={child.title}
                        selected={checkSelectedPage({ ...child, href: page.href + child.href })}
                      >
                        <Button
                          activeClassName={classes.active}
                          className={classes.button}
                          component={CustomRouterLink}
                          to={child.full ? child.href : window.dashboard_url + page.href + child.href}
                        >
                          <ListItemIcon>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.title} />
                        </Button>
                      </ListItem>
                    )
                  })}
                  <Divider />
                </List>
              </Collapse>
            )}
          </Fragment>
        )
      })}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default withRouter(SidebarNav);
