import React from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        cardContainer: {
            display: 'flex'
        },
        image: {
            minWidth: '100%',
            height: 350
        }
    })
);

export default function Baner() {
    const classes = useStyles();
    return (
        <div className={classes.cardContainer}>
            <img className={classes.image} src="baner.jpg" />
        </div>
    );
}