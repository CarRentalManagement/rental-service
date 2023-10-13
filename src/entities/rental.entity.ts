import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum RENTAL_STATUS {
  CREATED = 0,
  RENTING = 1,
  COMPLETED = 2,
  CANCELED = 3,
}

export enum RENTAL_TYPE {
  BY_HOUR = 0,
  BY_DAY = 1,
}

@Entity('rentals')
export class Rental extends BaseEntity {
  @Column()
  public vehicleId: number;

  @Column()
  public customerId: number;

  @Column()
  public date: Date;

  @Column({
    type: 'enum',
    enum: RENTAL_STATUS,
    default: RENTAL_STATUS.CREATED,
  })
  public status: RENTAL_STATUS;

  @Column({
    type: 'enum',
    enum: RENTAL_TYPE,
  })
  public type: RENTAL_TYPE;

  @Column()
  public duration: number;
}
