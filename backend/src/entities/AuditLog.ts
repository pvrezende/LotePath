import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("audit_logs")
export class AuditLog {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 80 })
    modulo!: string;

    @Column({ type: "varchar", length: 80 })
    acao!: string;

    @Column({ type: "text" })
    descricao!: string;

    @Column({ type: "uuid", nullable: true })
    usuario_id!: string | null;

    @Column({ type: "varchar", length: 120, nullable: true })
    usuario_nome!: string | null;

    @Column({ type: "varchar", length: 40, nullable: true })
    usuario_perfil!: string | null;

    @Column({ type: "jsonb", nullable: true })
    detalhes!: Record<string, unknown> | null;

    @CreateDateColumn({ type: "timestamptz" })
    criado_em!: Date;
}
