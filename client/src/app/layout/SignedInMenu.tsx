import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {useAppDispatch, useAppSelector} from "../redux/configureStore";
import {useHistory} from "react-router-dom";
import {signOut} from "../../features/account/accountSlice";

const SignedInMenu = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                color={'inherit'}
                sx={{typography: 'h6'}}
                onClick={handleClick}
            >
                {user?.email}
            </Button>
            <Menu

                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={()=>{
                    dispatch(signOut())
                    history.push("/")
                }}>Sign Out</MenuItem>
            </Menu>
        </>
    );
};
export default SignedInMenu