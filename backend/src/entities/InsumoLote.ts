import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Lote } from "./Lote.js";

@Entity('insumo_lote')
export class InsumoLote {
    @PrimaryGeneratedColumn("increment") id!: number;

    @ManyToOne(() => Lote, lote => lote.insumos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lote_id' })
    lote!: Lote;

    @Column("text") nome_insumo!: string;

    @Column("text", { nullable: true }) codigo_insumo!: string;

    @Column("text", { nullable: true }) lote_insumo!: string;

    @Column({ type: 'numeric' }) quantidade!: number;

    @Column("text") unidade!: string;
}