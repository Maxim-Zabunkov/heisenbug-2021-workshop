import { Fab } from "@material-ui/core";
import CardComponent from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import React from 'react';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../configure-store";
import { canAddToPurchase, selectPurchases } from "../../selectors/purchase-selector";
import { addPurchase, removePurchase } from "../../slices/purchase.slice";
import { CardProps } from './card.contracts';
import { SearchHighlighter } from "./search-highlighter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
            marginTop: 20,
            minWidth: 345,
            display: 'flex',
            flexDirection: 'column'
        },
        cardContent: {
            flex: '1 1 auto'
        },
        media: {
            height: 300,
            backgroundSize: 'contain',
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
        actionContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        actionText: {
            margin: 10
        },
        temperament: {
            marginBottom: 10
        }
    }),
);

export default function Card(props: CardProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const purchases = useSelector(selectPurchases);
    const countOfPurchases = purchases.filter(purchase => purchase.id === props.id)?.length;
    const isAddButtonDisabled = !useSelector(canAddToPurchase(props));

    const addPurchaseCallback = () => {
        dispatch(addPurchase(props));
    };

    const removePurchaseCallback = () => {
        dispatch(removePurchase(props));
    };

    const price = `$${props.price}`;
    const showShoppingCart = countOfPurchases === 0;

    return (
        <CardComponent
            key={props.id}
            className={classes.root}
        >
            <CardHeader title={<SearchHighlighter text={props.name} />} subheader={price} />
            <CardMedia className={classes.media} image={props.image?.url || 'no_image.jpg'} />
            <CardContent className={classes.cardContent}>
                <Typography variant="body1" color="secondary" component="p" className={classes.temperament}>
                    <SearchHighlighter text={props.temperament} />
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <SearchHighlighter text={props.description} />
                </Typography>
            </CardContent>
            <CardActions disableSpacing className={classes.actionContainer}>
                {showShoppingCart &&
                    <IconButton
                        aria-label="add to favorites"
                        onClick={addPurchaseCallback}
                        disabled={isAddButtonDisabled}
                    >
                        <ShoppingCart />
                    </IconButton>
                }
                {!showShoppingCart &&
                    <>
                        <Fab
                            size="small"
                            color="primary"
                            aria-label="add"
                            onClick={addPurchaseCallback}
                            disabled={isAddButtonDisabled}
                        >
                            <AddIcon />
                        </Fab>
                        <Typography
                            className={classes.actionText}
                            variant="overline"
                            display="block"
                            gutterBottom
                        >
                            {countOfPurchases} cats
                        </Typography>
                        <Fab size="small" color="primary" aria-label="remove" onClick={removePurchaseCallback}>
                            <RemoveIcon />
                        </Fab>
                    </>
                }
            </CardActions>
        </CardComponent>
    );

}
