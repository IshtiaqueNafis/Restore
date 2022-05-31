import React, {useState} from 'react';

import {
    Box, Button, Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Add, Delete, Remove} from "@mui/icons-material";
import {useStoreContext} from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import {LoadingButton} from "@mui/lab";
import BasketSummary from "./BasketSummary";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/redux/configureStore";
import {addBasketItemAsync, removeBasketItemAsync, setBasket} from "./basketSlice";

const BasketPage = () => {

    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();


    if (!basket) return <Typography variant={'h3'}>Your Basket is empty</Typography>
    return (
        <>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">SubTotal</TableCell>
                            <TableCell align="right"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map((item) => (
                            <TableRow
                                key={item.productId}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display={'flex'} alignItems={'center'}>
                                        <img src={item.pictureUrl} alt={item.name}
                                             style={{height: 50, marginRight: 20}}/>
                                        <span/>
                                        {item.name}
                                    </Box>
                                </TableCell>

                                <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton loading={status === `removeItem ${item.productId} rem`}
                                                   color={'error'}
                                                   onClick={() => dispatch(removeBasketItemAsync({
                                                       productId: item.productId,
                                                       quantity:1,
                                                       name:'rem'
                                                   }))}
                                    >
                                        <Remove/>
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton loading={status === `removeItem ${item.productId}`}
                                                   onClick={() => dispatch(addBasketItemAsync({productId: item?.productId}))}>
                                        <Add/>
                                    </LoadingButton>
                                </TableCell>


                                <TableCell align="right">${((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton

                                        loading={status === `removeItem ${item.productId} del`}
                                        color={'error'}
                                        onClick={() => dispatch(removeBasketItemAsync({
                                            productId: item.productId,
                                            quantity: item.quantity,
                                            name:'del'
                                        }))}>
                                        <Delete/>

                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}/>
                <Grid item xs={6}>
                    <BasketSummary/>
                    <Button component={Link} to={'/checkout'} variant='contained' size={'large'}>
                        CheckOut
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default BasketPage;