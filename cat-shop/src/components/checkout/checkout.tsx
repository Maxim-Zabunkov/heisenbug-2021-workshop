import { Modal } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../configure-store";
import { isAddressFormFilled as isAddressDetailsFormFilled } from '../../selectors/address-details-selector';
import { isPaymentDetailsFormFilled } from '../../selectors/payment-details-selector';
import { selectOrderInfo } from "../../selectors/review-details-selector";
import AddressForm from './address-form';
import Cart from "./cart";
import { CheckoutProps } from "./checkout.contracts";
import { OrderProcessing } from './order-processing';
import PaymentForm from './payment-form';
import Review from './review';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateY(-50%) translateX(-50%)'
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const steps = ['Cart', 'Shipping address', 'Payment details', 'Order summary'];

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <Cart />;
        case 1:
            return <AddressForm />;
        case 2:
            return <PaymentForm />;
        case 3:
            return <Review />;
        case 4:
            return <OrderProcessing />;
        default:
            throw new Error('Unknown step');
    }
}

export default function Checkout(props: CheckoutProps) {
    const classes = useStyles();

    const step1done = useSelector(isAddressDetailsFormFilled);
    const step2done = useSelector(isPaymentDetailsFormFilled);
    const [activeStep, setActiveStep] = React.useState(0);

    const isLastPage = activeStep === steps.length - 1;
    const isBackShown = activeStep !== 0;
    const isNextButtonDisabled = (!step1done && activeStep === 1) || (!step2done && activeStep === 2);
    const nextButtonText = isLastPage ? 'Place Order' : 'Next';

    const orderInfo = useSelector(selectOrderInfo);

    const dispatch = useAppDispatch();

    const handleNext = () => {
        setActiveStep(activeStep + 1);
        if (isLastPage) {
            dispatch({ type: 'SUBMIT_ORDER' });
        }
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    const handleClose = () => {
        if (orderInfo.inProgress) return;
        props.hideCheckoutScreen();
    };

    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div className={classes.root}>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Checkout
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {getStepContent(activeStep)}
                        {steps.length > activeStep &&
                            <div className={classes.buttons}>
                                {isBackShown && (
                                    <Button onClick={handleBack} className={classes.button}>
                                        Back
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={isNextButtonDisabled}
                                    className={classes.button}>
                                    {nextButtonText}
                                </Button>
                            </div>
                        }
                    </Paper>
                </main>
            </div>
        </Modal>
    );
}