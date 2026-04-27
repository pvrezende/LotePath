import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Lote } from "./Lote.js";

@Entity("produtos")
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    codigo!: string;

    @Column({ type: "varchar", nullable: false })
    nome!: string;

    @Column({ type: "text", nullable: true })
    descricao!: string | null;

    @Column({ type: "varchar", nullable: false })
    linha!: string;

    @Column({ type: "boolean", default: true })
    ativo!: boolean;

    @OneToMany(() => Lote, (lote) => lote.produto)
    lotes!: Lote[];
}