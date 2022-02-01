import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Token} from "./Token";

@Entity()
export class User {

    @PrimaryGeneratedColumn({})
    id: number;

    @Column()
    username: string;

    @Column()
    password: string

    @Column()
    id_type: string

    @OneToMany(() => Token, token => token.owner, {onUpdate: "CASCADE"})
    token: Token
}
