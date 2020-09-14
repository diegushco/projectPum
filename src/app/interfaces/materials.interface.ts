export interface ISupplie{
    id: number,
    name: number,
    quantity: number,
    measure: string,
    cost: number,
    taxes: number,
    total_cost: number,
    type: string,
    desc: string,
    image: string,
    status: string,
    min_quantity: number,
    taxes_id: number,
    provider_id: number,
    supplies_code?: string
  }