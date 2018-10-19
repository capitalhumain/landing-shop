
/// import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, REMOVE_ALL_TODOS, LOAD_TODO,
// LOAD_OPTIONS, INCREMENT, DECREMENT, SELECTED } from './actions';

import { Action } from 'redux';
import { StoreActions, StoreAction } from './actions';

export interface IAppState {
        products: any[];
        features: any[];
        config: any[];
        params: {};
        productsName: any;
        lastUpdate: Date;
        count: number;
        loading: boolean;
        error: null;
}

export const INITIAL_STATE: IAppState = {
        products: [],
        features: [],
        config: [],
        params: {},
        productsName: [],
        lastUpdate: null,
        count: 0,
        loading: false,
        error: null
};

export function rootReducer(state: IAppState, action): IAppState {

    switch (action.type) {



        case StoreActions.LOAD_PARAMS:
             const  params = action.payload;

             return Object.assign({}, state, {
                params: params[0],
                lastUpdate: new Date()
            });


        case StoreActions.LOAD_PRODUCTS:
             const  newProducts = action.payload;
             const  culture = action.meta;
             const productRowsConfig = [];
              newProducts.forEach( function (item, index) {
                   productRowsConfig.push(item['UserWantsToBuy']);
                   item.tobuy = 1;
                   if (culture === 'gb') {
                       item.price = item.price_GBP;
                   }

                });

            return Object.assign({}, state, {
                products: newProducts,
                features: [],
                productsName : productRowsConfig,
                lastUpdate: new Date()
            });

            case StoreActions.LOAD_CONFIG:

             const  config = action.payload;

            return Object.assign({}, state, {
                config: config,
                lastUpdate: new Date()
            });

        case StoreActions.SELECTED:

             const  product = action.payload[0];

             const products = state.products;
             const productsNew = [];
            products.forEach(function (item, index) {

            if (item.id === product) {
                item.tobuy = 1;
                } else {
                    item.tobuy = 0;
                }
              productsNew.push(item);
            });
            return Object.assign({}, state, {
                 products : productsNew,
                lastUpdate: new Date()
        });

          case StoreActions.LOAD_OPTIONS:
              const  newOptions = action.payload;
              const productsName = state.productsName;
              const options = [];
              const  selected = productsName.join(',').toLowerCase() ;

               newOptions.forEach( function (item, index) {

                 if (selected.indexOf('converter') === -1) {
                       // item.Converter = undefined;
                       delete item.Converter ;
                  }
                  if (selected.indexOf('home') === -1) {
                       // item.Home = undefined;
                       delete item.Home ;
                  }
                  if (selected.indexOf('professional') === -1) {
                       // item.Professionnal = undefined;
                       delete item.Professional ;
                  }
                  if (selected.indexOf('ultimate') === -1) {
                       // item.Ultimate = undefined;
                       delete item.Ultimate ;
                  }

            });


            return Object.assign({}, state, {
                features: newOptions,
                lastUpdate: new Date()
            });





    }

    return state;
}
