import React, {useEffect, useState} from 'react';
import {Product} from "../models/product";


function App() {
    const [products, setProducts] = useState<Product[]>() // means it will be typescript product
    useEffect(() => {
        fetch("http://localhost:5000/api/products").then(response => response.json()).then(data => setProducts(data))
    }, [])

    return (
        <div>
            <h1>Re-Store</h1>
            <ul>
                {products?.map(product => (
                    <li key={product.id}>
                        {product.name} -{product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
