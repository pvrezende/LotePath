import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class Usuario{

    @PrimaryGeneratedColumn('uuid')
    id_user!: string;

    @Column({ type: 'varchar', length: 100 })
    nome!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar', select: false })
    senha!: string; 

    @Column({ type: 'enum', enum: Perfil, default: Perfil.SOLICITANTE })
    perfil!: Perfil;

    @CreateDateColumn({ type: 'timestamp' })
    criado_em!: Date;
}