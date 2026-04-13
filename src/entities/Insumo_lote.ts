import {
    Column,
    Entity,
    Index, // ✅ Importação adicionada
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Lote } from "./Lote.js";

@Entity("insumo_lote")
// ✅ Índice composto para busca reversa (RF11): "Quais lotes usaram este insumo?"
@Index(["codigo_insumo", "lote_insumo"])
// ✅ Índice para a chave estrangeira: Listar insumos de um lote específico
@Index(["lote"])
export class InsumoLote {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Lote, (lote) => lote.insumos, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "lote_id" }) // ✅ Garante que a coluna no banco se chame lote_id
    lote!: Lote;

    @Column({ type: "varchar", nullable: false })
    nome_insumo!: string;

    @Column({ type: "varchar", nullable: true })
    codigo_insumo!: string | null;

    @Column({ type: "varchar", nullable: true })
    lote_insumo!: string | null;

    @Column({ type: "numeric", nullable: false })
    quantidade!: number;

    @Column({ type: "varchar", nullable: false })
    unidade!: string;
}
