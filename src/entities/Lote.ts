import { Column, DataSource, ForeignKey, PrimaryColumn } from "typeorm";

export class Produto {

    @PrimaryColumnGenerated('uuid')
    id_produto!: string;

    @Column({type: 'varchar', unique: true, nullable: false})
    numero_lote!: string;

    @Column({type: ForeignKey(() => Produto), nullable: false})
    id_produto!: string;

    @Column({type: DataSource, nullable: false})
    data_producao!: Date;

    @Column ({enum: 'manha' | 'tarde' | 'noite', nullable: false})
    turno!: string;

    @Column({type: ForeignKey(() => Usuario), nullable: false})
    operador_id!: string;

    @Column ({type: 'integer', nullable: false})
    quantidade_produto!: number;
}