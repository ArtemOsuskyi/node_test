import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({name: "expire_date",type: "timestamp without time zone"})
    expireDate: Date

    @ManyToOne(() => User, user => user.token, {cascade: true})
    @JoinColumn({name:"owner_id"})
    owner: User
}
