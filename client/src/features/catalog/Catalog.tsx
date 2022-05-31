import React, {useEffect, useState} from 'react';
import {Product} from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {useAppDispatch, useAppSelector} from "../../app/redux/configureStore";
import {fetchProductsAsync, productSelectors} from "./catalogSlice";
import NotFound from "../../app/errors/NotFound";


const Catalog = () => {

    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded,status} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (!productsLoaded) {
            dispatch(fetchProductsAsync())
        }

    }, [productsLoaded])

    if (status==='pending') return <LoadingComponent message={'Loading Products'}/>
    if(!products) return <NotFound/>
    return (
        <>
            <ProductList products={products}/>
        </>
    );
};

export default Catalog;
