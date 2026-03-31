import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Produto } from "./Produto.js";
import { Usuario } from "./Usuario.js";
import { InsumoLote } from "./InsumoLote.js";
import { InspecaoLote } from "./InspecaoLote.js";

export enum Turno { MANHA = 'manha', TARDE = 'tarde', NOITE = 'noite' }
export enum StatusLote {
    EM_PRODUCAO = 'em_producao',
    AGUARDANDO_INSPECAO = 'aguardando_inspecao',
    APROVADO = 'aprovado',
    APROVADO_RESTRICAO = 'aprovado_restricao',
    REPROVADO = 'reprovado'
}

@Entity('lote')
export class Lote {
    @PrimaryGeneratedColumn("increment") id!: number;

    @Column("text", { unique: true }) numero_lote!: string;

    @ManyToOne(() => Produto, produto => produto.lotes)
    @JoinColumn({ name: 'produto_id' })
    produto!: Produto;

    @Column({ type: 'date' }) data_producao!: string;

    @Column({ type: 'enum', enum: Turno }) turno!: Turno;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'operador_id' })
    operador!: Usuario;

    @Column("int") quantidade_prod!: number;

    @Column("int", { default: 0 }) quantidade_repr!: number;

    @Column({ type: 'enum', enum: StatusLote }) status!: StatusLote;

    @Column({ type: 'text', nullable: true }) observacoes!: string;

    @CreateDateColumn({ type: 'timestamptz' }) aberto_em!: Date;

    @Column({ type: 'timestamptz', nullable: true }) encerrado_em!: Date;

    @OneToMany(() => InsumoLote, insumo => insumo.lote)
    insumos!: InsumoLote[];

    @OneToOne(() => InspecaoLote, inspecao => inspecao.lote)
    inspecao!: InspecaoLote;
}