import React, {useState} from 'react';
import Catalog from "../../features/catalog/Catalog";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";
import {Route, Switch} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";


function App() {
    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? 'dark' : 'light'
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === 'light' ? '#eaeaea' : '#121212'
            }

        }
    });


    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>
                <Switch>

                    <Route exact path={'/'} component={HomePage}/>
                    <Route exact path={'/catalog'} component={Catalog}/>
                    <Route path={'/catalog/:id'} component={ProductDetails}/>
                    <Route path={'/about'} component={AboutPage}/>
                    <Route path={'/contact'} component={ContactPage}/>
                </Switch>

            </Container>

        </ThemeProvider>
    );
}

export default App;
