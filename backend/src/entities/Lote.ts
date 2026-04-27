import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Produto } from "./Produto.js";
import { Usuario } from "./Usuario.js";
import { InsumoLote } from "./Insumo_lote.js";
import { InspecaoLote } from "./Inspecao_lote.js";

@Entity("lotes")
export class Lote {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    numero_lote!: string;

    @ManyToOne(() => Produto, (produto) => produto.lotes, { nullable: false })
    produto!: Produto;

    @Column({ type: "date", nullable: false })
    data_producao!: Date;

    @Column({ type: "enum", enum: ["manha", "tarde", "noite"], nullable: false })
    turno!: "manha" | "tarde" | "noite";

    @ManyToOne(() => Usuario, (usuario) => usuario.lotesOperados, { nullable: false })
    operador!: Usuario;

    @Column({ type: "integer", nullable: false })
    quantidade_prod!: number;

    @Column({ type: "integer", default: 0 })
    quantidade_repr!: number;

    @Column({
        type: "enum",
        enum: [
            "em_producao",
            "aguardando_inspecao",
            "aprovado",
            "aprovado_restricao",
            "reprovado",
        ],
        default: "em_producao",
    })
    status!:
        | "em_producao"
        | "aguardando_inspecao"
        | "aprovado"
        | "aprovado_restricao"
        | "reprovado";

    @Column({ type: "text", nullable: true })
    observacoes!: string | null;

    @Column({ type: "timestamptz", default: () => "now()" })
    aberto_em!: Date;

    @Column({ type: "timestamptz", nullable: true })
    encerrado_em!: Date | null;

    @OneToMany(() => InsumoLote, (insumo) => insumo.lote)
    insumos!: InsumoLote[];

    @OneToOne(() => InspecaoLote, (inspecao) => inspecao.lote)
    inspecao!: InspecaoLote;
}