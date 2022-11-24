import {Entity, hasOne, model, property} from '@loopback/repository';
import {Billing} from './billing.model';

@model({settings: {strict: false}})
export class Transaction extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'date',
  })
  createAt?: string;

  @property({
    type: 'date',
  })
  updateAt?: string;

  @hasOne(() => Billing)
  billing: Billing;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
