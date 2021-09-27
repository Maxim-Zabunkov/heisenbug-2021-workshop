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
  const { orderId, inProgress, error } = useSelector(selectOrderInfo);
  const classes = useStyles();

  if (inProgress) {
    return <div className={classes.spinner}>
      <CircularProgress size={60} />
    </div>;
  }
  if (error) {
    return <React.Fragment>
      <Typography variant="h5" gutterBottom id="title">
        Something goes wrong.
      </Typography>
      <Typography variant="subtitle1" id="text">
        Your order was not submitted due to technical issue.<br/>
        Please try again or contact support center.
      </Typography>
    </React.Fragment>;
  }

  return <React.Fragment>
    <Typography variant="h5" gutterBottom id="title">
      Thank you for your order.
    </Typography>
    <Typography variant="subtitle1" id="text">
      Your order number is <b>#{orderId}</b>.<br />
      We have emailed your order confirmation, and will
      send you an update when your order has shipped.
    </Typography>
  </React.Fragment>;
}