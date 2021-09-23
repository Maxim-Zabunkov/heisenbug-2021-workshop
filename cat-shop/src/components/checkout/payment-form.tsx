import React, {ChangeEvent, useCallback} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {
    setCardName,
    setCardNumber,
    setCvv,
    setExpiryDate
} from "../../slices/payment-details.slice";
import {useAppDispatch} from "../../configure-store";
import {useSelector} from "react-redux";
import {paymentDetailsSelector} from "../../selectors/payment-details-selector";

export default function PaymentForm() {
    const dispatch = useAppDispatch();
    const { cardName, cardNumber, cvv, expiryDate } = useSelector(paymentDetailsSelector);

    const cardNameCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setCardName(event.target.value));
        },
        [dispatch],
    );
    const cardNumberCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setCardNumber(event.target.value));
        },
        [dispatch],
    );
    const cvvCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setCvv(event.target.value));
        },
        [dispatch],
    );

    const expiryDateCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setExpiryDate(event.target.value));
        },
        [dispatch],
    );

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cardName"
                        defaultValue={ cardName }
                        label="Name on card"
                        fullWidth
                        onChange={ cardNameCallback }
                        autoComplete="cc-name" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cardNumber"
                        defaultValue={ cardNumber }
                        onChange={ cardNumberCallback }
                        label="Card number"
                        fullWidth
                        autoComplete="cc-number"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="expDate"
                        defaultValue={ expiryDate }
                        onChange={ expiryDateCallback }
                        label="Expiry date"
                        fullWidth
                        autoComplete="cc-exp"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cvv"
                        label="CVV"
                        defaultValue={ cvv }
                        onChange={ cvvCallback }
                        helperText="Last three digits on signature strip"
                        fullWidth
                        autoComplete="cc-csc"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}