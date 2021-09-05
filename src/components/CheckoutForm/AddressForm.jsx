import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import CustomTextField from './CustomTextField';
import { Link } from 'react-router-dom';
import { commerce } from '../../lib/commerce'

const AddressForm = ({ checkoutToken, next }) => {
    const methods = useForm();
    const [shippingCountries, setShippingCountries] = useState([])
    const [shippingCountry, setShippingCountry] = useState('')
    const [shippingSubdivisions, setshippingSubdivisions] = useState([])
    const [shippingSubdivision, setshippingSubdivision] = useState('')
    const [shippingOptions, setShippingOptions] = useState([])
    const [shippingOption, setShippingOption] = useState('')

    //console.log(checkoutToken);
    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        //console.log(countries);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    };
    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setshippingSubdivisions(subdivisions);
        setshippingSubdivision(Object.keys(subdivisions)[0])
    }
    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
       // console.log(options);
        setShippingOptions(options);
        setShippingOption(options[0].id);
    };
    useEffect(() => {
        fetchShippingCountries(checkoutToken.id); // eslint-disable-next-line
    }, []) 

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry) // eslint-disable-next-line
    }, [shippingCountry]) 
    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);  // eslint-disable-next-line
    }, [shippingSubdivision]); 

    //console.log(Object.entries(shippingCountries).map(([code,name])=>({id:code,label:name})) ) 
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
    const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})}` }))
    //console.log(countries);
    //console.log(subdivisions);
    //console.log(shippingOptions);
    //console.log(options);
    return (
        <>
            <Typography variant='h6' gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
                    <Grid container spacing={3}>
                        <CustomTextField name='firstName' label='First Name' />
                        <CustomTextField name='lastName' label='Last Name' />
                        <CustomTextField name='address' label='Address' />
                        <CustomTextField name='email' label='Email' />
                        <CustomTextField name='city' label='City' />
                        <CustomTextField name='zip' label='ZIP / Postal Code' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping SubDivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setshippingSubdivision(e.target.value)}>
                                {subdivisions.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                {options.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} to='/cart' variant='outlined'>Back to cart</Button>
                        <Button type='submit' variant='contained' color='primary' >Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
