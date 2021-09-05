import React, { useState, useEffect } from 'react'
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom'
import useStyles from './styles'

import PaymentForm from '../PaymentForm';
import AddressForm from '../AddressForm';
import { commerce } from '../../../lib/commerce';
const steps = ['shipping address', 'payment details'];

const CheckOut = ({ cart, order, onCaptureCheckout, error }) => {
    const classes = useStyles();
    const [activeStep, setactiveStep] = useState(0)
    const [checkoutToken, setcheckoutToken] = useState(null)
    const [shippingData, setshippingData] = useState({})


    const nextStep = () => setactiveStep((prevActiveStep) => prevActiveStep + 1)
    const prevStep = () => setactiveStep((prevActiveStep) => prevActiveStep - 1)

    const next = (data) => {
        setshippingData(data)
        nextStep();
    }

    console.log(shippingData);
    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} prevStep={prevStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} />

    let Confirmation = () => !order.customer ? (
        <>
            <div>
                <Typography varaint='h3' align='center' color='secondary'>Thanks For your purchase</Typography>
                <Divider className={classes.divider} />
                
            </div>
            <br/>
            <div style={{display:'flex',justifyContent:'center'}}>
              <Button component={Link} to='/' color ='primary' variant='outlined'>Back to Home</Button>
            </div> 

        </>
    ): (
        <div className={classes.spinner}>
          <CircularProgress/>
        </div>
    )
    // if(error){
    //     <>
    //     <Typography>Error</Typography>
    //     </>
    // }
    const generateToken = async () => {
        try {
            const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
            //console.log(token);
            setcheckoutToken(token)
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        generateToken();
    }, [])
    console.log(checkoutToken);
    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default CheckOut
