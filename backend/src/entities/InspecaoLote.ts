import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Lote } from "./Lote.js";
import { Usuario } from "./Usuario.js";

export enum ResultadoInspecao {
    APROVADO = 'aprovado',
    APROVADO_RESTRICAO = 'aprovado_restricao',
    REPROVADO = 'reprovado'
}

@Entity('inspecao_lote')
export class InspecaoLote {
    @PrimaryGeneratedColumn("increment") id!: number;

    @OneToOne(() => Lote, lote => lote.inspecao, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lote_id' }) 
    lote!: Lote;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'inspetor_id' })
    inspetor!: Usuario;

    @Column({ type: 'enum', enum: ResultadoInspecao }) resultado!: ResultadoInspecao;

    @Column("int", { default: 0 }) quantidade_repr!: number;

    @Column({ type: 'text', nullable: true }) descricao_desvio!: string;

    @CreateDateColumn({ type: 'timestamptz' }) inspecionado_em!: Date;
}