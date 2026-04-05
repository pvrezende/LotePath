import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Lote } from "./Lote";
import { Usuario } from "./Usuario";


@Entity()
export class Inspecao_lote {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.inspecoes)
    inspetor_id!: Usuario;

    @OneToOne(() => Lote, (lote) => lote.inspecao)
    @JoinColumn()
    lote_id!: Lote;

    @Column({ type: 'enum', enum: ['aprovado', 'aprovado_restricao', 'reprovado'] })
    status!: 'aprovado' | 'aprovado_restricao' | 'reprovado'

    @Column({ type: 'integer', default: 0 })
    quantidade_repr!: number;

    @Column({ type: 'text', nullable: true })
    descricao_desvio!: String;

    @Column({ type: 'timestamptz', default: () => 'now()' })
    inspecionado_em!: Date;

}