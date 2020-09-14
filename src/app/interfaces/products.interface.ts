export interface IProduct {
    id?: number;
    product_code?: string;
    typeproductId: number;
    date_in?: Date;
    name: string;
    quantity: number;
    width?: number;
    long?: number;
    height?: number;
    densityId?: number,
    production_cost: number;
    sell_price: number;
    origin: string;
    usage: string;
    status?: string;
    provider_id?: number;
    price:number;
    taxesId:number;
    profit_margin: number;
  }

  export interface IOptionalProduct{
    width:number;
    height:number;
    long:number;
    densityId:number;
  }