import {TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography, Grid} from "@mui/material";
import {useStoreContext} from "../../app/context/StoreContext";
import {useState} from "react";

export default function BasketSummary() {
    const {basket, setBasket, removeItem} = useStoreContext();
    const [subTotal,setSubTotal] = useState(0)
    const deliveryFee = 0;
    
    return (
        
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{subTotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{subTotal + deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
           
        
    )
}