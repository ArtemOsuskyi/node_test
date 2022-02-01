import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({type: "timestamp without time zone"})
    expire_date: Date

    @ManyToOne(() => User, {cascade: true})
    @JoinColumn({name:"owner_id"})
    owner: User
}
