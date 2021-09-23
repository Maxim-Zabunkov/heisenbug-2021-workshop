import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from "react-redux";
import { selectAddressDetails } from "../../selectors/address-details-selector";
import { paymentDetailsSelector } from "../../selectors/payment-details-selector";
import { groupedPurchasesSelector, purchaseTotalPrice } from "../../selectors/purchase-selector";
import { Purchase } from './purchase';
import { GroupedPurchase } from "./review.contracts";

const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    }
}));

export default function Review() {
    const classes = useStyles();
    const groupedPurchases = useSelector(groupedPurchasesSelector);
    const totalPrice = useSelector(purchaseTotalPrice);
    const addressDetails = useSelector(selectAddressDetails);
    const paymentDetails = useSelector(paymentDetailsSelector);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <List disablePadding>
                {groupedPurchases.map((purchase: GroupedPurchase, i: number) => (
                    <Purchase key={i} purchase={purchase} index={i} readonly={true} />
                ))}
                <ListItem className={classes.listItem} key="total">
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" className={classes.total}>
                        ${totalPrice}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Shipping
                    </Typography>
                    <Typography gutterBottom>John Smith</Typography>
                    <Typography gutterBottom>{Object.values(addressDetails).join(', ')}</Typography>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Payment details
                    </Typography>
                    <Grid container>
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography gutterBottom>Card Type</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>VISA</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>Name</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{paymentDetails.cardName}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>Card Number</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{paymentDetails.cardNumber}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>Expiry Date</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>{paymentDetails.expiryDate}</Typography>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
