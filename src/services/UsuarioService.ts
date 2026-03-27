export class UsuarioService {

    private userRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.userRepo = appDataSource.getRepository(Usuario);
    }

    async getAll() {
        return this.userRepo.find();
    }

    async getById(id: string) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new Error('Usuario não encontrado');
        }
        return user;
    }

    async getEmail(id: string) {
        const user = await this.userRepo.findOneBy({ email: id });
        if (!user) {
            throw new Error('Email não encontrado');
        }
        return user.email;
    }
    async createUser(data: Usuario) {
        const usuario = await this.getEmail(data.email);
        if (usuario) {
            throw new Error('Email já existe');
        }
        data.senha = await bcrypt.hash(data.senha, 2);
        const novoUsuario = await this.userRepo.create(data);
        await this.userRepo.save(novoUsuario);
        return novoUsuario;

    }
}