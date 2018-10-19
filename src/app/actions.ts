

import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { dispatch } from '@angular-redux/store';
import { FluxStandardAction } from 'flux-standard-action';
import { Product, AnimalType } from './shared/product.model';

type Payload = any[];
interface MetaData { animalType: AnimalType; }
type Culture = string;
export type StoreAction = FluxStandardAction<Payload, Culture>;

@Injectable()
export class StoreActions {
static readonly LOAD_ANIMALS = 'LOAD_ANIMALS';
static readonly LOAD_STARTED = 'LOAD_STARTED';
static readonly LOAD_SUCCEEDED = 'LOAD_SUCCEEDED';
static readonly LOAD_FAILED = 'LOAD_FAILED';
static LOAD_CONFIG = 'LOAD_CONFIG';
static LOAD_PRODUCTS = 'LOAD_PRODUCTS';
static SELECTED = 'SELECTED';
static LOAD_OPTIONS = 'LOAD_OPTIONS';
static LOAD_PARAMS = 'LOAD_PARAMS';

 /*@dispatch()
  loadAnimals = (animalType: AnimalType): StoreAction => ({
    type: StoreActions.LOAD_ANIMALS,
    meta: { animalType },
    payload: null,
  });
  loadStarted = (animalType: AnimalType): StoreAction => ({
    type: StoreActions.LOAD_STARTED,
    meta: { animalType },
    payload: null,
  })

  loadSucceeded = (animalType: AnimalType, payload: Payload): StoreAction => ({
    type: StoreActions.LOAD_SUCCEEDED,
    meta: { animalType },
    payload,
  })

  loadFailed = (animalType: AnimalType, error): StoreAction => ({
    type: StoreActions.LOAD_FAILED,
    meta: { animalType },
    payload: null,
    error,
  })*/
loadParams = (params: any[]): StoreAction => ({
    type: StoreActions.LOAD_PARAMS,
    payload: params,
    meta : ''
  })
loadCartConfig = (cartConfig: any[]): StoreAction => ({
    type: StoreActions.LOAD_CONFIG,
    payload: cartConfig,
    meta : ''
  })
loadProducts = (products: Product[], culture: Culture): StoreAction => ({
    type: StoreActions.LOAD_PRODUCTS,
    payload: products,
    meta: culture,
  })
loadOptions = (OptionConfig: any[]): StoreAction => ({
    type: StoreActions.LOAD_OPTIONS,
    payload: OptionConfig,
    meta : ''
  })

 selected = (product: Product[] ): StoreAction => ({
    type: StoreActions.SELECTED,
    payload: product,
    meta : ''
  })

}
