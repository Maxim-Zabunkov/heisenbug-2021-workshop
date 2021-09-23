import { Fab, ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useAppDispatch } from "../../configure-store";
import { addPurchase, removePurchase } from "../../slices/purchase.slice";
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
    },
    price: {
        fontWeight: 'bold',
        marginRight: 8,
        marginLeft: 8,
        textAlign: 'right',
        width: 50
    },
    count: {
        fontWeight: 'bold',
        textAlign: 'center',
        width: 30
    }
}));

export interface PurchaseProps {
    purchase: GroupedPurchase;
    index: number;
    readonly?: boolean;
}

export function Purchase(props: PurchaseProps): JSX.Element {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { purchase: { purchase, count }, index, readonly } = props;
    const add = () => {
        dispatch(addPurchase(purchase));
    };
    const remove = () => {
        dispatch(removePurchase(purchase));
    }
    return (
        <ListItem className={classes.listItem} key={purchase.id}>
            <ListItemText primary={(index + 1) + '. ' + purchase.name} />
            {!readonly && <Fab size="small" color="primary" aria-label="add" onClick={add}>
                <AddIcon />
            </Fab>}
            <Typography className={classes.count} variant="body2">{`${count}`}</Typography>
            {!readonly && <Fab size="small" color="primary" aria-label="add" onClick={remove}>
                <RemoveIcon />
            </Fab>}
            <Typography className={classes.price} variant="body2">{`$${purchase.price}`}</Typography>
            <Typography className={classes.price} variant="body2">{`$${purchase.price * count}`}</Typography>
        </ListItem>
    );
}
