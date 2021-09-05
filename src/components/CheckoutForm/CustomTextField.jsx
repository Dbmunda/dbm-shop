import React from 'react'
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const CustomTextField = ({ name, label, Placeholder }) => {
    const { control } = useFormContext();
    return (
        <Grid item xs={12} sm={6}>
            <Controller
                render={({ field }) => <TextField {...field} variant='outlined' fullWidth  required label={label} placeholder={Placeholder} />}
                name={name}
               control={control}
                
            />
        </Grid>
    )
}

export default CustomTextField
