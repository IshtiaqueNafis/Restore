import React from 'react';
import {AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography} from "@mui/material";
import {Link, NavLink} from "react-router-dom";
import {ShoppingCart} from "@mui/icons-material";
import {useStoreContext} from "../context/StoreContext";
import {useAppSelector} from "../redux/configureStore";

interface Props {
    darkMode: boolean
    handleThemeChange: () => void
}

const midLinks = [
    {title: 'catalog', path: "/catalog"},
    {title: 'about', path: "/about"},
    {title: 'contact', path: "/contact"},
]

const rightLinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
]

const navStyles = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'secondary.main'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

const Header = ({darkMode, handleThemeChange}: Props) => {
    const {basket} = useAppSelector(state => state.basket);
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);
    return (
        <AppBar position="static" sx={{mb: 4}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                <Box display="flex" alignItems="center">
                    <Typography variant="h6" component={NavLink} to={'/'} exact sx={navStyles}>
                        Re-Store
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange}/>
                </Box>
                <Box display={'flex'} alignItems="center">


                    <List sx={{display: "flex"}}>
                        {midLinks.map(({title, path}) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={{
                                    color: 'inherit', typography: 'h6', '&:hover': {
                                        color: 'secondary.main'
                                    },
                                    '&.active': {
                                        color: 'text.secondary'
                                    },

                                }}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box display={'flex'} alignItems="center">


                    <IconButton component={Link} to={'/basket'} size="large" sx={{color: 'inherit'}}>
                        <Badge badgeContent={itemCount} color='secondary'>
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>
                    <List sx={{display: 'flex'}}>
                        {rightLinks.map(({title, path}) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={{
                                    color: 'inherit',
                                    typography: 'h6',
                                    '&:hover': {
                                        color: 'secondary.main'
                                    },
                                    '&.active': {
                                        color: 'text.secondary'
                                    }

                                }}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
