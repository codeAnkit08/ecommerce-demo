import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

    constructor(private usersRepository: UsersRepository) {}

    getUsers() {
        return this.usersRepository.findAll();
    }

    getUserById(id: string) {
        return this.usersRepository.findById(id);
    }   

    getUserByEmail(email: string) {
        return this.usersRepository.findByEmail(email);
    }

    createUser(data: { name: string; email: string, password: string }) {
        return this.usersRepository.createUser(data);
    }
}
