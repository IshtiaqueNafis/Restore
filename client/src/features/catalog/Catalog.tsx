import React, {useEffect, useState} from 'react';
import {Product} from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector} from "../../app/redux/configureStore";
import {fetchFilters, fetchProductsAsync, productSelectors} from "./catalogSlice";
import NotFound from "../../app/errors/NotFound";
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid, Pagination,
    Paper,
    Radio,
    RadioGroup,
    TextField, Typography
} from "@mui/material";
const sortOptions = [
    {value:'name', label:"Alphabetical"},
    {value:'priceDesc', label:"Price-High to Low"},
    {value:'price', label:"Price-Low to High"},
]

const Catalog = () => {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded, status, filtersLoaded, types, brands} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync())


    }, [productsLoaded, dispatch])

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters())
    }, [dispatch, filtersLoaded])

    if (status === 'pending') return <LoadingComponent message={'Loading Products'}/>
    if (!products) return <NotFound/>
    return (
        <Grid container spacing={4}>
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <TextField label={'search products'}
                               variant={'outlined'}
                               fullWidth
                    />
                </Paper>

                <Paper sx={{mb: 2,p:2}}>
                    <FormControl>
                        <RadioGroup>
                            {sortOptions.map(({value,label})=>(
                                <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                            ))}
                           
                        </RadioGroup>
                    </FormControl>
                </Paper>
                <Paper sx={{mb: 2,p:2}}>
                    <FormGroup>
                        {brands.map(brand=>(
                            <FormControlLabel control={<Checkbox />} label={brand} key={brand} />
                        ))}
                        
                    </FormGroup>
                </Paper>

                <Paper sx={{mb: 2,p:2}}>
                    <FormGroup>
                        {types.map(type=>(
                            <FormControlLabel control={<Checkbox />} label={type} key={type} />
                        ))}

                    </FormGroup>
                </Paper>
                
            </Grid>
            <Grid item xs={9}>

                <ProductList products={products}/>
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={9}>
                <Box display={"flex"} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>
                        Displaying 1 to 6 of 20 items
                       
                    </Typography>
                    <Pagination
                        color={'secondary'}
                        size={'large'}
                        count={10}
                        page={2}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default Catalog;
