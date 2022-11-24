import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Cart extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
  })
  createAt?: string;

  @property({
    type: 'date',
  })
  updateAt?: string;

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
