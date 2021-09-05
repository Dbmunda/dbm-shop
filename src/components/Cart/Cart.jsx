import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core';
import useStyles from './styles'
import CartItem from './CartItem/CartItem';
import { Link } from 'react-router-dom';
const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {
    const classes = useStyles();
    // const isEmpty = !cart.total_unique_items;
    //console.log(cart);
    const EmptyCart = () => (
        <div style={{marginTop:'50px'}}>
            <Typography variant='h6' gutterBottom align='center'>you have no items in your cart</Typography>
            <Button component={Link} to='/' variant='outlined' fullWidth color='secondary'>Click here to add some item</Button>

        </div>
            
    )
const FilledCart = () => (
    <>
        <Grid container spacing={3}>
            {cart.line_items.map((item) => (
                <Grid item xs={12} sm={4} key={item.id}>
                    <CartItem item={item} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} />
                </Grid>
            ))}
        </Grid>
        <div className={classes.cardDetails}>
            <Typography variant='h4'>
                SubTotal : {cart.subtotal.formatted_with_symbol}
            </Typography>
            <div>
                <Button className={classes.emptyButton} size='large' type='button' variant='contained' color='secondary'
                    onClick={handleEmptyCart} >Empty Cart</Button>
                <Button component={Link} to='/checkout' className={classes.checkoutButton} size='large' type='button' variant='contained' color='primary' >Checkout</Button>
            </div>

        </div>
    </>
)
if (!cart.line_items) return 'Loading...';
return (
    <Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant='h3' align='center' gutterBottom>Your Shopping Cart</Typography>
        {!cart.total_unique_items ? <EmptyCart /> : <FilledCart />}
    </Container>
)
}

export default Cart
