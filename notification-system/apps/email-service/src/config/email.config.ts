export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun";
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgrid?: {
    apiKey: string;
  };
  from: {
    name: string;
    email: string;
  };
}

export const getEmailConfig = (): EmailConfig => {
  const provider = process.env.EMAIL_PROVIDER || "smtp";

  const config: EmailConfig = {
    provider: provider as any,
    from: {
      name: process.env.EMAIL_FROM_NAME || "Notification System",
      email: process.env.EMAIL_FROM_ADDRESS || "noreply@example.com",
    },
  };

  if (provider === "smtp") {
    config.smtp = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };
  } else if (provider === "sendgrid") {
    config.sendgrid = {
      apiKey: process.env.SENDGRID_API_KEY || "",
    };
  }

  return config;
};
