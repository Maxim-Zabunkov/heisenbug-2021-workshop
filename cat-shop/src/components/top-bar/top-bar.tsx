import React, {ChangeEvent, useCallback} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {alpha, makeStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import classNames from 'classnames';
import {Badge, InputBase} from "@material-ui/core";
import {useAppDispatch} from "../../configure-store";
import {setSearchPattern} from "../../slices/search.slice";
import {useSelector} from "react-redux";
import {selectNofPurcnahses} from "../../selectors/purchase-selector";
import {TopBarProps} from "./top-bar.contracts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 60,
    height: 60
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  shoppingCartButton : {
    paddingTop: 8,
    marginRight: -16
  },
  toolbar: {
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    alignSelf: 'flex-start',
  },
  search: {
    position: 'relative',
    marginTop: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
}));


export default function TopBar(props: TopBarProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const numberOfPurchases = useSelector(selectNofPurcnahses);

  const onSearch = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch(setSearchPattern(event.target.value));
      },
      [dispatch],
  );
  return (
      <div className={classNames(classes.root , 'top-bar')}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Welcome
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  onChange={onSearch}
                  inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <IconButton
                className={ classes.shoppingCartButton }
                disabled={ !numberOfPurchases }
                aria-label="display more actions"
                edge="end"
                color="inherit"
                onClick={ props.onShoppingCartClick }
            >
            <Badge
                badgeContent={ numberOfPurchases }
                color="error"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
            >
              <ShoppingCart />
            </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
  );
}