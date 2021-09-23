import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectOrderInfo } from '../../selectors/review-details-selector';

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export function OrderProcessing(): JSX.Element {
  const { orderId, inProgress } = useSelector(selectOrderInfo);
  const classes = useStyles();

  if (inProgress) {
    return <div className={classes.spinner}>
      <CircularProgress size={60}/>
    </div>;
  }
  return <React.Fragment>
    <Typography variant="h5" gutterBottom>
      Thank you for your order.
    </Typography>
    <Typography variant="subtitle1">
      Your order number is <b>#{orderId}</b>.<br/>
      We have emailed your order confirmation, and will
      send you an update when your order has shipped.
    </Typography>
  </React.Fragment>
}