import { IProduct } from './products.interface';
export interface IPurchase{
  purchase: IPurch,
  products: detailProduct[]
}

export interface IPurch{
    purchase_code: string,
    date: string,
    provider_id: number,
    taxes_id: number,
    items_quantity: number,
    purchase_cost:  number,
    purchase_taxes: number,
    total_cost: number,
    profit_margin : number
}

export interface detailProduct{
  id: number,
  product_code: string,
  name: string,
  quantity: number,
  width: number,
  long: number,
  height: number,
  production_cost: number,
  price: number,
  sell_price: number,
  origin: string,
  usage: string,
  status: string,
  typeproductId: number,
  taxesId: number,
  densityId: number,
  isNew: boolean,
  profit_margin: number,
  total?:number,
  cost?:number,
  quantityTotal?:number
}