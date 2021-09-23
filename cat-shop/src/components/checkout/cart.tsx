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
    }
}));

export default function Cart() {
    const classes = useStyles();
    const groupedPurchases = useSelector(groupedPurchasesSelector);
    const totalPrice = useSelector(purchaseTotalPrice);
    const addressDetails = useSelector(selectAddressDetails);
    const paymentDetails = useSelector(paymentDetailsSelector);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Cart
            </Typography>
            <List disablePadding>
                {groupedPurchases.map((purchase: GroupedPurchase, i: number) => (
                    <Purchase key={i} purchase={purchase} index={i} />
                ))}
                <ListItem className={classes.listItem} key="total">
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" className={classes.total}>
                        ${totalPrice}
                    </Typography>
                </ListItem>
            </List>           
        </React.Fragment>
    );
}
