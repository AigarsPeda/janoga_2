export default ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: env("SMTP_EMAIL"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: `"Janoga" <${env("SMTP_EMAIL")}>`,
        defaultReplyTo: `"Janoga" <${env("SMTP_EMAIL")}>`,
      },
    },
  },
});
