export class Product {
  id: number;
  name: string;
  price: number;
  tobuy: number;
  best_seller: boolean;
  categories: number[];
  image: string;
  imagebig: string;
  description: string;
  yourchoice: string;
  baseprice: string;
  tagline: string;
  taglineoptions: string [];
  toshow: boolean;
  discount: number;
  code: string;
  sku: string;
  animalType: AnimalType;
}

export const ANIMAL_TYPES = {
  fr: 'EUR',
  en: 'USD',
  de: 'EUR',
  it: 'EUR',
  gb: 'GBP',
  es: 'EUR',
};

// TODO: is there a way to improve this?
export type AnimalType = string;

export interface IAnimal {
  id: number;
  name: string;
  price: number;
  tobuy: number;
  best_seller: boolean;
  categories: number[];
  image: string;
  imagebig: string;
  description: string;
  yourchoice: string;
  baseprice: string;
  tagline: string;
  taglineoptions: string [];
  toshow: boolean;
  discount: number;
  code: string;
  sku: string;
  animalType: AnimalType;
}

export interface IAnimalList {
  items: {};
  loading: boolean;
  error: any;
}

export const fromServer = (record: any): IAnimal => ({
  id: record.id,
  name: record.name.toLowerCase(),
  animalType: record.animalType,
  price: record.price,
  tobuy: record.tobuy,
  best_seller: record.best_seller,
  categories: record.categories,
  image: record.image,
  imagebig: record.imagebig,
  description: record.description,
  yourchoice: record.yourchoice,
  baseprice: record.baseprice,
  tagline: record.tagline,
  taglineoptions: record.taglineoptions,
  toshow: record.toshow,
  discount: record.discount,
  code: record.code,
  sku: record.sku
});
