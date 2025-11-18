import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from 'typeorm';
import {User} from "../users/user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
    user: User;

    @Column({type: "text"})
    endpoint: string;

    @Column({type: "text"})
    p256dh: string;

    @Column({type: "text"})
    auth: string;
}