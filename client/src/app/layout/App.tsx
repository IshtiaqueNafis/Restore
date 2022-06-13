import React, {useEffect, useState} from 'react';
import Catalog from "../../features/catalog/Catalog";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";
import {Route, Switch} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/Basket/BasketPage";
import {getCookie} from "../utils/utils";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import CheckOutPage from "../../features/checkoout/CheckOutPage";
import {useAppDispatch} from "../redux/configureStore";
import {setBasket} from "../../features/Basket/basketSlice";
import LogIn from "../../features/account/LogIn";
import Register from "../../features/account/Register";
import {fetchCurrentUser} from "../../features/account/accountSlice";

function App() {


    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const buyerId = getCookie('buyerId');
        dispatch(fetchCurrentUser());
        if (buyerId) {
            agent.Basket.get().then(basket => dispatch(setBasket(basket))).catch(error => console.log(error)).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [setBasket])

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

//toastStyle={{ backgroundColor: "crimson" }}

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    if (loading) return <LoadingComponent message={'intalizing app'}/>
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position={'bottom-right'} hideProgressBar theme={"colored"}/>
            <CssBaseline/>
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>
                <Switch>

                    <Route exact path={'/'} component={HomePage}/>
                    <Route exact path={'/catalog'} component={Catalog}/>
                    <Route path={'/catalog/:id'} component={ProductDetails}/>
                    <Route path={'/about'} component={AboutPage}/>

                    <Route path={'/contact'} component={ContactPage}/>
                    <Route path={'/server-error'} component={ServerError}/>
                    <Route path={'/basket'} component={BasketPage}/>
                    <Route path={'/checkout'} component={CheckOutPage}/>
                    <Route path={'/login'} component={LogIn}/>
                    <Route path={'/register'} component={Register}/>
                    <Route component={NotFound}/>


                </Switch>

            </Container>

        </ThemeProvider>
    );
}

export default App;
