import nodemailer, { Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import path from 'path';
import { IEmailService, EmailOptions } from '../../application/shared/ports/IEmailService';
import { Logger } from '../logging/logger.service';
import { getEmailConfig, EmailConfig } from '../config/email.config';

export class NodemailerAdapter implements IEmailService {
  private readonly logger: Logger;
  private readonly config: EmailConfig;
  private transporter: Transporter;
  private readonly templateCache: Map<string, Handlebars.TemplateDelegate>;

  constructor() {
    this.logger = new Logger('NodemailerAdapter');
    this.config = getEmailConfig();
    this.templateCache = new Map();

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth:
        this.config.user && this.config.password
          ? {
              user: this.config.user,
              pass: this.config.password,
            }
          : undefined,
    });
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.config.from,
        to: options.to,
        subject: options.subject,
        text: options.body,
        html: options.html,
        attachments: options.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
        })),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info(`Email sent to ${options.to}`, { subject: options.subject });
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }

  async sendPasswordReset(email: string, token: string, userName: string): Promise<void> {
    const template = await this.loadTemplate('password-reset');
    const baseUrl = process.env.APP_FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const html = template({
      userName,
      resetLink,
      expirationHours: 24,
    });

    await this.send({
      to: email,
      subject: 'SGG - Restablecer Contrasena',
      body: `Hola ${userName}, usa el siguiente enlace para restablecer tu contrasena: ${resetLink}`,
      html,
    });
  }

  async sendWelcome(email: string, userName: string): Promise<void> {
    const template = await this.loadTemplate('welcome');
    const baseUrl = process.env.APP_FRONTEND_URL || 'http://localhost:3000';

    const html = template({
      userName,
      loginLink: `${baseUrl}/login`,
    });

    await this.send({
      to: email,
      subject: 'SGG - Bienvenido al Sistema de Gestion Ganadera',
      body: `Bienvenido ${userName} al Sistema de Gestion Ganadera (SGG). Inicia sesion en: ${baseUrl}/login`,
      html,
    });
  }

  private async loadTemplate(name: string): Promise<Handlebars.TemplateDelegate> {
    const cached = this.templateCache.get(name);
    if (cached) {
      return cached;
    }

    const templatePath = path.join(__dirname, 'templates', `${name}.hbs`);
    try {
      const source = await fs.readFile(templatePath, 'utf-8');
      const compiled = Handlebars.compile(source);
      this.templateCache.set(name, compiled);
      return compiled;
    } catch (error) {
      this.logger.error(`Failed to load email template: ${name}`, error);
      throw new Error(`Email template not found: ${name}`);
    }
  }
}
