import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpPurpose } from '@prisma/client';
import { Resend } from 'resend';

const SUBJECTS: Record<OtpPurpose, string> = {
  SIGNUP_VERIFICATION: 'Verify your CoachLink account',
  PASSWORD_RESET: 'Reset your CoachLink password',
};

const INTROS: Record<OtpPurpose, string> = {
  SIGNUP_VERIFICATION: 'Use this code to verify your CoachLink account.',
  PASSWORD_RESET: 'Use this code to reset your CoachLink password.',
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from =
      this.config.get<string>('EMAIL_FROM') ??
      'CoachLink <onboarding@resend.dev>';
  }

  async sendOtpEmail(
    to: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    // Always log during dev so the flow stays testable even if delivery fails
    // or no provider is configured yet.
    this.logger.log(`[OTP] ${purpose} code for ${to}: ${code}`);

    if (!this.resend) return;

    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject: SUBJECTS[purpose],
        html: `<p>${INTROS[purpose]}</p><p style="font-size:28px;font-weight:700;letter-spacing:4px;">${code}</p><p>This code expires in 10 minutes.</p>`,
      });
    } catch (err) {
      // Never let a delivery failure break the auth flow — the code is already
      // stored and logged above, so the user (or a dev watching logs) isn't stuck.
      this.logger.error(
        `Failed to send ${purpose} email to ${to}`,
        err instanceof Error ? err.stack : err,
      );
    }
  }
}
