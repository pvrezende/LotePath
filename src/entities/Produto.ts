import { Column } from "typeorm";

export class Produto {
    @PrimaryGeneratedColumn('uuid')
    id_produto!: string;

    @Column({type: 'varchar', unique: true, nullable: false})
    codigo!: string;

    @Column ({type: 'varchar', nullable: false})
    nome!: string;

    @Column({type: 'varchar', nullable: true})
    descricao!: string;

    @Column({type: 'varchar', nullable: false})
    linha!: string;

    @Column ({type: 'boolean', default: true})
    ativo!: boolean;
}