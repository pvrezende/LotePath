import { Column, Entity, In, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Produto } from "./Produto.js";
import { Usuario } from "./Usuario.js";
import { Inspecao_lote } from "./Inspecao_lote.js";


@Entity()
export class Lote {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    numero_lote!: string;

    @ManyToOne(() => Produto, (produto) => produto.lotes)
    produto_id!: Produto;

    @ManyToOne(() => Lote, (lote) => lote.insumos)
    lote!: Lote;
    
    @OneToOne (()=> Inspecao_lote,(inspecao)=> inspecao.lote)
    inspecao!: Inspecao_lote;

    @Column({ type: 'date', nullable: false })
    data_producao!: Date;

    @Column({ type: 'enum', enum: ['manha', 'tarde', 'noite'], nullable: false })
    turno!: 'manha' | 'tarde' | 'noite';

    @ManyToOne(() => Usuario, (usuario) => usuario.usuarios)
    operador_id!: Usuario;

    @Column({ type: 'integer', nullable: false })
    quantidade_produto!: number;

    @Column({ type: 'enum', enum: ['em_producao', 'aguardando_inspecao', 'aprovado_restricao', 'aprovado', 'reprovado'] })
    status!: 'em_producao' | 'aguardando_inspecao' | 'aprovado_restricao' | 'aprovado' | 'reprovado';

    @Column({ type: 'varchar', nullable: true })
    observacoes!: string | null;

    @Column({ type: 'timestamptz', default: () => 'now()' })
    aberto_em!: Date;

    @Column({ type: 'timestamptz', nullable: true })
    encerrado_em!: Date | null;
}