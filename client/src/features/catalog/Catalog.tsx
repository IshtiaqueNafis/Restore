import React, {useEffect, useState} from 'react';
import {Product} from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";



const Catalog = () => {

    const [products, setProducts] = useState<Product[]>([]) // means it will be typescript product
    const [loading, setLoading] = useState(true) ;

    useEffect(() => {
        agent.Catalog.list().then(products => setProducts(products)).catch(e =>console.log(e)).finally(()=>setLoading(false));
    }, [])

if(loading) return <LoadingComponent message={'Loading Products'}/>
    return (
        <>
            <ProductList products={products}/>
        </>
    );
};

export default Catalog;
