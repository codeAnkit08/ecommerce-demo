import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
    private repo: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(User);
    }

    async createUser(data: Partial<User>) {
        const user = this.repo.create(data);
        return this.repo.save(user);
    }

    async findAll() {
        return this.repo.find();
    }

    async findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    async findById(id: string) {
        return this.repo.findOne({ where: { id } })
    };
}