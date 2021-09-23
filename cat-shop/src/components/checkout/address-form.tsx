import React, {ChangeEvent, useCallback} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {useAppDispatch} from "../../configure-store";
import {
    setAddressLine1,
    setAddressLine2,
    setCity,
    setCountry,
    setFirstName,
    setLastName,
    setState,
    setZipCode
} from "../../slices/address-details.slice";
import {useSelector} from "react-redux";
import {selectAddressDetails} from "../../selectors/address-details-selector";

export default function AddressForm() {
    const dispatch = useAppDispatch();

    const { firstName, lastName, addressLine1, addressLine2,
        zipCode, city, state, country
    } = useSelector(selectAddressDetails);

    const setFirstNameCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setFirstName(event.target.value));
        },
        [dispatch],
    );
    const setLastNameCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setLastName(event.target.value));
        },
        [dispatch],
    );
    const setAddressLine1Callback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setAddressLine1(event.target.value));
        },
        [dispatch],
    );
    const setAddressLine2Callback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setAddressLine2(event.target.value));
        },
        [dispatch],
    );
    const setCountryCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setCountry(event.target.value));
        },
        [dispatch],
    );
    const setCityCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setCity(event.target.value));
        },
        [dispatch],
    );
    const setZipCodeCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setZipCode(event.target.value));
        },
        [dispatch],
    );
    const setStateCallback = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            dispatch(setState(event.target.value));
        },
        [dispatch],
    );
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        defaultValue={ firstName }
                        onChange={ setFirstNameCallback }
                        name="firstName"
                        label="First name"
                        fullWidth
                        autoComplete="given-name"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        defaultValue={ lastName }
                        onChange={ setLastNameCallback }
                        name="lastName"
                        label="Last name"
                        fullWidth
                        autoComplete="family-name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="address1"
                        defaultValue={ addressLine1 }
                        onChange={ setAddressLine1Callback }
                        name="address1"
                        label="Address line 1"
                        fullWidth
                        autoComplete="shipping address-line1"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="address2"
                        onChange={ setAddressLine2Callback }
                        defaultValue={ addressLine2 }
                        name="address2"
                        label="Address line 2"
                        fullWidth
                        autoComplete="shipping address-line2"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        onChange={ setCityCallback }
                        defaultValue={ city }
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        autoComplete="shipping address-level2"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="state"
                        onChange={ setStateCallback }
                        defaultValue={ state }
                        name="state"
                        label="State/Province/Region"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="zip"
                        onChange={ setZipCodeCallback }
                        defaultValue={ zipCode }
                        name="zip"
                        label="Zip / Postal code"
                        fullWidth
                        autoComplete="shipping postal-code"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="country"
                        onChange={ setCountryCallback }
                        defaultValue={ country }
                        name="country"
                        label="Country"
                        fullWidth
                        autoComplete="shipping country"
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}