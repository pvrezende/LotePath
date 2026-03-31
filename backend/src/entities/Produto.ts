import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Lote } from "./Lote.js"; 

@Entity('produto')
export class Produto {
    @PrimaryGeneratedColumn("increment") id!: number;

    @Column("text", { unique: true }) codigo!: string;

    @Column("text") nome!: string;

    @Column("text", { nullable: true }) descricao!: string;

    @Column("text") linha!: string;

    @Column("boolean", { default: true }) ativo!: boolean;

    @OneToMany(() => Lote, lote => lote.produto)
    lotes!: Lote[];
}