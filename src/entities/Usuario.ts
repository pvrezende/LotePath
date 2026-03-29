import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from "../types/Perfil.js";
import { Lote } from "./Lote";
import { Inspecao_lote } from "./Inspecao_lote.js";


@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn('uuid')
    id_user!: string;

    @OneToMany (() => Lote, (lote)=> lote.usuario)
    usuarios!: Lote[];

    @OneToOne (()=> Inspecao_lote,(inspecao)=> inspecao.inspetor_id)
    inspecoes!: Inspecao_lote[];

    @Column({ type: 'varchar', length: 100 })
    nome!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar', select: false })
    senha!: string;

    @Column({ type: 'enum', enum: Perfil, default: Perfil.SOLICITANTE })
    perfil!: Perfil;

    @CreateDateColumn({ type: 'timestamp' })
    criado_em!: Date;
}