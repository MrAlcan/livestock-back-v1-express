import { z } from 'zod';

const EmailConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(587),
  secure: z.boolean().default(false),
  user: z.string().optional(),
  password: z.string().optional(),
  from: z.string().default('noreply@sgg.com'),
});

export type EmailConfig = z.infer<typeof EmailConfigSchema>;

export function getEmailConfig(): EmailConfig {
  return EmailConfigSchema.parse({
    host: process.env.EMAIL_HOST || 'localhost',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || undefined,
    password: process.env.EMAIL_PASSWORD || undefined,
    from: process.env.EMAIL_FROM || 'noreply@sgg.com',
  });
}
