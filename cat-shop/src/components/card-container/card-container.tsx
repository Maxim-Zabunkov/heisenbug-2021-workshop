import React from 'react';
import Card from "../card/card";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {selectFileterdCards} from "../../selectors/cards-selector";

const useStyles = makeStyles(() =>
    createStyles({
        cardContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginLeft: 8,
            marginRight: 8,
            marginBottom: 20
        }
    })
);

export default function CardContainer() {
    const classes = useStyles();
    const items = useSelector(selectFileterdCards);

    if(!items || !items.length){
        return null;
    }

    return (
        <div className={classes.cardContainer}>
            {items.map(item => <Card key={item.id} {...item} /> )}
        </div>
    );
}