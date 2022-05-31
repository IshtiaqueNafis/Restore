import React, {useState} from 'react';
import {Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";
import {Product} from "../../app/models/product";
import {Link} from "react-router-dom";
import agent from "../../app/api/agent";
import {LoadingButton} from "@mui/lab";
import {currencyFormat} from "../../app/utils/utils";
import {useAppDispatch} from "../../app/redux/configureStore";
import {setBasket} from "../Basket/basketSlice";

interface Props {
    product: Product
}

const ProductCard = ({product}: Props) => {
 
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    function handleAdditem(productId: number) {
        setLoading(true);
        agent.Basket.addItem(productId).then(basket => dispatch(setBasket(basket))).catch((error) => console.log(error)).finally(() => setLoading(false));
    }

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'primary.main'}
                }}
            />

            <CardMedia
                sx={{height: 140, backgroundSize: 'contain', bgcolor: 'primary.light'}}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color={'secondary'} variant="h5" component="h5">
                    ${currencyFormat(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand}/{product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton loading={loading} onClick={() => handleAdditem(product.id)}>Add to cart</LoadingButton>
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
