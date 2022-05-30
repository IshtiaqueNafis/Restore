import {TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography, Grid} from "@mui/material";
import {useStoreContext} from "../../app/context/StoreContext";
import {useState} from "react";
import {currencyFormat} from "../../app/utils/utils";

export default function BasketSummary() {
    const {basket} = useStoreContext();
    const subTotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ??0;
    const deliveryFee = subTotal > 1000 ? 0 : 500
   
    
    return (
        
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subTotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{currencyFormat(subTotal+deliveryFee)}</TableCell>
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