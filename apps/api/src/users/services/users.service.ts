import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '@auth/services/password.service';
import type { RegisterPayload } from '@etape/types/schemas/auth';
import type { UpdateUserPayload } from '@etape/types/schemas/user';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(createUserDto: RegisterPayload) {
    const hashedPassword = await this.passwordService.encryptPassword(
      createUserDto.password,
    );
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        cguAcceptedAt: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserPayload) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateLastLogin(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
