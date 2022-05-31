import React, {useEffect, useState} from 'react';
import {
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useParams} from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {LoadingButton} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../app/redux/configureStore";
import {addBasketItemAsync, removeBasketItemAsync} from "../Basket/basketSlice";
import {fetchSingleProductAsync, productSelectors} from "./catalogSlice";

const ProductDetails = () => {
    const {basket, status} = useAppSelector(state => state.basket);
    const {status: productStatus} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>()
    const product = useAppSelector(state => productSelectors.selectById(state, id));
    const [quantity, setQuantity] = useState(0);

    const item = basket?.items.find(i => i.productId === product?.id);


    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if (!product) dispatch(fetchSingleProductAsync(parseInt(id)));
    }, [id, item, dispatch, product])

    function handleInputChange(event: any) {
        if (event.target.value > 0) {
            setQuantity(parseInt(event.target.value));
        }

    }

    function handleUpdateCart() {
        if (!item || quantity > item.quantity) { // means the item is not on the basket. 
            const updateQuantity = item ? quantity - item.quantity : quantity
            dispatch(addBasketItemAsync({productId: product?.id!, quantity: updateQuantity}));

        } else {
            const updateQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updateQuantity}));
        }
    }

    if (productStatus === 'pending') return <LoadingComponent message={'Loading Product'}/>
    if (!product) return <NotFound/>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant={'h3'}>
                    {product.name}

                </Typography>
                <Divider sx={{mb: 2}}/>
                <Typography variant={'h4'} color={'secondary'}>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField variant={'outlined'}
                                   onChange={handleInputChange}
                                   type={'number'}
                                   label={'Quantity in Cart'}
                                   fullWidth
                                   value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            disabled={item?.quantity === quantity || !item && quantity === 0}
                            loading={status.includes(`removeItem ${product.id}`)}
                            onClick={handleUpdateCart} sx={{height: '55px'}} color={'primary'} size={'large'}
                            variant={'contained'}
                            fullWidth>
                            {item ? 'Update Quantity' : "Add to Cart"}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>


        </Grid>
    );
};

export default ProductDetails;
