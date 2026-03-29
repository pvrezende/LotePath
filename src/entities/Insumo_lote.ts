import { Column, Entity, ManyToOne, } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Lote } from "./Lote.js";

@Entity()
export class Insumo_lote {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Lote, (lote) => lote.insumos)
    lote!: Lote;

    @Column({ type: 'varchar', nullable: false })
    nome_insumo!: string;

    @Column({ type: 'varchar', nullable: true })
    codigo_insumo!: string;

    @Column({ type: 'varchar', nullable: true })
    lote_insumo!: string | null;

    @Column({ type: 'numeric', nullable: false })
    quantidade!: number;

    @Column({ type: 'varchar', nullable: false })
    unidade_medida!: string;

}
    