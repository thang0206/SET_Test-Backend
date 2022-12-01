import {Entity, model, property, hasMany} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Billing extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  totalPrice: number;

  @property({
    type: 'string',
    required: true,
  })
  payment: string;

  @property({
    type: 'date',
  })
  createdAt?: string;

  @property({
    type: 'date',
  })
  updatedAt?: string;

  @hasMany(() => Product)
  products: Product[];

  @property({
    type: 'string',
  })
  transactionId?: string;

  constructor(data?: Partial<Billing>) {
    super(data);
  }
}

export interface BillingRelations {
  // describe navigational properties here
}

export type BillingWithRelations = Billing & BillingRelations;
