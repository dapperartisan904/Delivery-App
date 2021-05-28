import { 
    CART_TOTAL_CHANGE,
    CART_CHANGE
} from '../constants';


export function changeCount(count) {
    // console.log("recall", count)
    if(count == "undefined" || typeof count =="undefined"){
        count = {
            basket_count: "0 items",
            basket_total: "£0.00"
        }
    }
    
    return {
        type: CART_TOTAL_CHANGE,
        payload: count
    }
}

export function changeCart(cart) {
    // console.log("recall", cart)
    if(cart == "undefined" || typeof cart =="undefined"){
        cart = false
    }
    
    return {
        type: CART_CHANGE,
        payload: cart
    }
}