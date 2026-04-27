import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from "../types/Perfil.js";
import { Lote } from "./Lote.js";
import { InspecaoLote } from "./Inspecao_lote.js";

@Entity("usuarios")
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 100 })
    nome!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar", select: false })
    senha!: string;

    @Column({ type: "enum", enum: Perfil })
    perfil!: Perfil;

    @CreateDateColumn({ type: "timestamp" })
    criado_em!: Date;

    @OneToMany(() => Lote, (lote) => lote.operador)
    lotesOperados!: Lote[];

    @OneToMany(() => InspecaoLote, (inspecao) => inspecao.inspetor)
    inspecoes!: InspecaoLote[];
}