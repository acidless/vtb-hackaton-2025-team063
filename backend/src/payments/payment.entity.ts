import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {User} from "../users/user.entity";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ type: 'int' })
    category: number;

    @Column({type: "date"})
    date: Date;

    @Column({default: false})
    payed: boolean;

    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
    user: User;
}
