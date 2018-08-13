import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {BookReducer} from "./reducers/BookReducer";



let reducers  = {
    BookReducer
};

export default createStore(
    combineReducers(reducers),
    applyMiddleware(thunk, logger),
);

