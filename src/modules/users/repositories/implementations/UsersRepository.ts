import { getRepository, Repository,  } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import {Game} from '../../../games/entities/Game'
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private game: Repository<Game>;

  constructor() {
    this.repository = getRepository(User);
    this.game = getRepository(Game)
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await this.repository.findOne({
      relations: ['games'],
      where: {
        id: user_id
      }
    }
    );
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`SELECT * FROM users ORDER BY first_name ASC`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      'select * from users where first_name ILIKE $1 and last_name ILIKE $2',
      [first_name, last_name],
    );
    
  }
}
