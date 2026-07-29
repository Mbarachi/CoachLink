import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpPurpose } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { sanitizeUser } from '../common/sanitize-user';
import { PrismaService } from '../prisma/prisma.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

const OTP_TTL_MINUTES = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async issueOtp(userId: string, email: string, purpose: OtpPurpose) {
    const code = this.generateOtpCode();
    await this.prisma.otp.create({
      data: {
        userId,
        email,
        code,
        purpose,
        expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000),
      },
    });
    // No email/SMS provider configured yet — log so the flow is testable in dev.
    console.log(`[OTP] ${purpose} code for ${email}: ${code}`);
  }

  private signToken(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }

  async signUp(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        passwordHash,
        role: 'ATHLETE',
        isVerified: false,
      },
    });

    await this.issueOtp(user.id, user.email, 'SIGNUP_VERIFICATION');

    return { user: sanitizeUser(user), accessToken: this.signToken(user) };
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return { user: sanitizeUser(user), accessToken: this.signToken(user) };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        email: dto.email,
        purpose: 'SIGNUP_VERIFICATION',
        consumed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp || otp.code !== dto.otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired code.');
    }

    await this.prisma.$transaction([
      this.prisma.otp.update({
        where: { id: otp.id },
        data: { consumed: true },
      }),
      this.prisma.user.update({
        where: { id: otp.userId },
        data: { isVerified: true },
      }),
    ]);

    return { verified: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // Always report success, even if the email isn't registered, so we don't leak account existence.
    if (user) {
      await this.issueOtp(user.id, user.email, 'PASSWORD_RESET');
    }
    return { success: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otp = await this.prisma.otp.findFirst({
      where: { email: dto.email, purpose: 'PASSWORD_RESET', consumed: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp || otp.code !== dto.otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired code.');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.otp.update({
        where: { id: otp.id },
        data: { consumed: true },
      }),
      this.prisma.user.update({
        where: { id: otp.userId },
        data: { passwordHash },
      }),
    ]);

    return { success: true };
  }
}
