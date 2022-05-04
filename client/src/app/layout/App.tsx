import React, {useEffect, useState} from 'react';
import {Product} from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";


function App() {
    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? 'dark' : 'light'
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background:{
                default: paletteType === 'light' ?'#eaeaea':'#121212'
            }

        }
    });

    const [products, setProducts] = useState<Product[]>([]) // means it will be typescript product

    useEffect(() => {
        fetch("http://localhost:5000/api/products").then(response => response.json()).then(data => setProducts(data))
    }, [])

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>

                <Catalog products={products}/>
            </Container>

        </ThemeProvider>
    );
}

export default App;
