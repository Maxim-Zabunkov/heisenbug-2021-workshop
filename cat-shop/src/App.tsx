import React, { useCallback, useState} from 'react';
import CardContainer from "./components/card-container/card-container";
import Baner from "./components/baner/baner";
import TopBar from "./components/top-bar/top-bar";
import Checkout from "./components/checkout/checkout";
import './styles/index.css';

function App() {
    const [showCheckout, setShowCheckout] = useState(false);
    const showCheckoutScreen = useCallback(
        () => {
            setShowCheckout(true);
        },
        [],
    );
    const hideCheckoutScreen = useCallback(
        () => {
            setShowCheckout(false);
        },
        [],
    );
    return (
        <div>
            <TopBar onShoppingCartClick={ showCheckoutScreen }/>
            <Baner />
            { showCheckout && <Checkout hideCheckoutScreen={ hideCheckoutScreen }/> }
            <CardContainer/>
        </div>
    );
}

export default App;