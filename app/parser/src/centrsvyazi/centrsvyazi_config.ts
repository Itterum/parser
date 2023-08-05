import { ParsingConfig } from '../parse_page';

export type Price = {
  value: number;
  currency: string;
}

export interface Product {
  name: string;
  newPrice: Price;
  oldPrice: Price;
  image: string;
  url: string;
}

export const productConfig: ParsingConfig = {
  waitingSelector: '.products .product-item',
  nameElement: '.product_link > h3',
  newPriceElement: '.price_cart > .doubleprice > .newprice',
  oldPriceElement: '.price_cart > .doubleprice > .oldprice',
  imageElement: '.product-image',
  productLink: '.product_link'
};
