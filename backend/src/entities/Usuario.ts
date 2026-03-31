import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn("increment") id!: number;

    @Column("text") nome!: string;
    
    @Column("text", { unique: true }) email!: string;
    
    @Column("text") senha!: string;
    
    @Column("text") perfil!: string; 
}
