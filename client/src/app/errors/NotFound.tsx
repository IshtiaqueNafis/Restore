import React from 'react';
import {Button, Container, Divider, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const NotFound = () => {
    return (
        <Container component={Paper} sx={{height: 400}}>
            <Typography gutterBottom variant={'h3'}>
                Oops - not found
            </Typography>
            <Divider>
                <Button fullWidth component={Link} to={"/catalog"}>
                    Go back to shop
                </Button>
            </Divider>
        </Container>
    );
};

export default NotFound;