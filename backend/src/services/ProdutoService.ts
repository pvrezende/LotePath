import { DataSource, Repository } from "typeorm";
import { Produto } from "../entities/Produto.js";
import { CreateProdutoDTO, UpdateProdutoDTO } from "../dtos/ProdutoDTO.js";
import { AppError } from "../errors/AppError.js";
import { AuditService } from "./AuditService.js";

export class ProdutoService {
    private produtoRepo: Repository<Produto>;
    private auditService: AuditService;

    constructor(appDataSource: DataSource) {
        this.produtoRepo = appDataSource.getRepository(Produto);
        this.auditService = new AuditService(appDataSource);
    }

    async getAll() {
        return this.produtoRepo.find({
            order: {
                nome: "ASC"
            }
        });
    }

    async getById(id: string) {
        const produto = await this.produtoRepo.findOneBy({ id });

        if (!produto) {
            throw new AppError("Produto não encontrado", 404);
        }

        return produto;
    }

    async create(data: CreateProdutoDTO, usuarioId?: string) {
        const produtoExistente = await this.produtoRepo.findOneBy({
            codigo: data.codigo
        });

        if (produtoExistente) {
            throw new AppError("Já existe um produto com esse código", 409);
        }

        const produto = this.produtoRepo.create({
            codigo: data.codigo,
            nome: data.nome,
            descricao: data.descricao ?? null,
            linha: data.linha,
            ativo: data.ativo ?? true
        });

        await this.produtoRepo.save(produto);

        await this.auditService.createLog({
            modulo: "produtos",
            acao: "PRODUTO_CRIADO",
            descricao: `Produto ${produto.codigo} - ${produto.nome} criado`,
            usuarioId,
            detalhes: {
                produtoId: produto.id,
                codigo: produto.codigo,
                nome: produto.nome,
                linha: produto.linha,
                ativo: produto.ativo
            }
        });

        return produto;
    }

    async update(id: string, data: UpdateProdutoDTO, usuarioId?: string) {
        const produto = await this.getById(id);

        const dadosAnteriores = {
            codigo: produto.codigo,
            nome: produto.nome,
            descricao: produto.descricao,
            linha: produto.linha,
            ativo: produto.ativo
        };

        if (data.codigo && data.codigo !== produto.codigo) {
            const codigoExistente = await this.produtoRepo.findOneBy({
                codigo: data.codigo
            });

            if (codigoExistente) {
                throw new AppError("Já existe um produto com esse código", 409);
            }
        }

        if (data.codigo !== undefined) produto.codigo = data.codigo;
        if (data.nome !== undefined) produto.nome = data.nome;
        if (data.descricao !== undefined) produto.descricao = data.descricao ?? null;
        if (data.linha !== undefined) produto.linha = data.linha;
        if (data.ativo !== undefined) produto.ativo = data.ativo;

        await this.produtoRepo.save(produto);

        await this.auditService.createLog({
            modulo: "produtos",
            acao: "PRODUTO_ATUALIZADO",
            descricao: `Produto ${produto.codigo} - ${produto.nome} atualizado`,
            usuarioId,
            detalhes: {
                produtoId: produto.id,
                antes: dadosAnteriores,
                depois: {
                    codigo: produto.codigo,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    linha: produto.linha,
                    ativo: produto.ativo
                }
            }
        });

        return produto;
    }

    async delete(id: string, usuarioId?: string) {
        const produto = await this.getById(id);

        const dadosProduto = {
            produtoId: produto.id,
            codigo: produto.codigo,
            nome: produto.nome,
            descricao: produto.descricao,
            linha: produto.linha,
            ativo: produto.ativo
        };

        await this.auditService.createLog({
            modulo: "produtos",
            acao: "PRODUTO_EXCLUIDO",
            descricao: `Produto ${produto.codigo} - ${produto.nome} excluído`,
            usuarioId,
            detalhes: dadosProduto
        });

        await this.produtoRepo.remove(produto);
    }
}
