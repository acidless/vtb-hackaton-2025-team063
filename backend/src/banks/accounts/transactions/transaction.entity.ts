import {Entity, Column, Index, PrimaryColumn, ManyToOne} from 'typeorm';
import {User} from "../../../users/user.entity";

@Entity()
export class Transaction {
    @PrimaryColumn()
    id: string;

    @Column()
    @Index()
    categoryId: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        eager: false,
    })
    user: User;
}
