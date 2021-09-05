import React, { useState, useEffect } from 'react'
//require('dotenv').config()
import { Navbar, Products, Cart, Checkout } from './components'
import { commerce } from './lib/commerce'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
const App = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }
    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }
    const handleAddtoCart = async (productId, quantity) => {

        const response = await commerce.cart.add(productId, quantity);
        setCart(response.cart);
    }
    const handleUpdateCartQty = async (productId, quantity) => {
        const response = await commerce.cart.update(productId, { quantity });
        setCart(response.cart);
    }
    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    }
    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    }
    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, [])
    //console.log(products);
    // console.log(cart);
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
          console.log("heelo i am refresh cart");
        setCart(newCart);
      };

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);
             console.log("handleCaptureCheckout");
            refreshCart();
        } catch (error) {
           refreshCart();
            setErrorMessage(error.data.error.message);
            console.log("handleCaptureCheckout error part");
        }
    };
    return (
        // <div>
        //   <Navbar totalItems={cart.total_items}/>
        //   {/* <Products products={products} onAddtoCart={handleAddtoCart}/> */}
        //   <Cart cart={cart}/>
        // </div>
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path='/'>
                        <Products products={products} onAddtoCart={handleAddtoCart} />
                    </Route>
                    <Route path='/cart' >
                        <Cart
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route path='/checkout'>
                        <Checkout
                            cart={cart}
                            order={order}
                            onCaptureCheckout={handleCaptureCheckout}
                            error={errorMessage}
                        />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
