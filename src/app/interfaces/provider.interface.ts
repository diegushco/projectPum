export interface IProvider {
    id: number;
    provider_code?: string;
    name: string;
    nit: string;
    departmentId: number;
    cityId  : number;
    address: string;
    email: string;
    phone1: string;
    phone2: string;
    website: string;
  }