import { 
    CART_TOTAL_CHANGE,
    CART_CHANGE
} from '../constants';
const initialState = {
    count: 
    {"basket_count": "0 items",
    "basket_total": "£0.00",
    "count": 0},
    cart: false
};
const countReducer = (state = initialState, action) => {
    // console.log(action, "action = = = = = = === = = = = === = = = = =")

    switch(action.type) {
        case CART_TOTAL_CHANGE:
        return {
            ...state,
            count: action.payload
        };
        case CART_CHANGE:
        return {
            ...state,
            cart: action.payload
        };
        default:
        return state;
    }
}

export default countReducer;