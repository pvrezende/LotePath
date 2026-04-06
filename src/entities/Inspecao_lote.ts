import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lote } from "./Lote.js";
import { Usuario } from "./Usuario.js";

@Entity("inspecao_lote")
export class InspecaoLote {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => Lote, (lote) => lote.inspecao, { onDelete: "CASCADE" })
    @JoinColumn()
    lote!: Lote;

    @ManyToOne(() => Usuario, (usuario) => usuario.inspecoes, { nullable: false })
    inspetor!: Usuario;

    @Column({ type: "enum", enum: ["aprovado", "aprovado_restricao", "reprovado"] })
    resultado!: "aprovado" | "aprovado_restricao" | "reprovado";

    @Column({ type: "integer", default: 0 })
    quantidade_repr!: number;

    @Column({ type: "text", nullable: true })
    descricao_desvio!: string | null;

    @Column({ type: "timestamptz", default: () => "now()" })
    inspecionado_em!: Date;
}