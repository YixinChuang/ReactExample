import { bindActionCreators, createStore, applyMiddleware, combineReducers } from 'redux';
import asyncAwait from 'redux-async-await';
import thunkMiddleware from 'redux-thunk';

export default function cbnReduce<T>(obj, cross_reduces = null) {
    function logger({ getState }) { //自訂 applyMiddleware 範例
        return (next) => (action) => {
            //console.log('閘道', 'action:', action);
            let returnValue = next(action);
            //console.log('閘道', 'Next之後', getState());
            return returnValue;
        }
    }
    let getCombineReducers = combineReducers<T>(obj);

    function rootReducer(state, action) {
        let tempstate = getCombineReducers(state, action),
            finalstate = cross_reduces(tempstate, action);
        return finalstate;
    }

    var st = cross_reduces == null ?
        createStore(getCombineReducers, applyMiddleware(thunkMiddleware, asyncAwait, logger)) :
        createStore(rootReducer, applyMiddleware(thunkMiddleware, asyncAwait, logger));

    return st;
}