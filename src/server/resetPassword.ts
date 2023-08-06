import { humanReadableNanoid } from "~/helpers/nanoidHelper";
import { prisma } from "./db";
import * as argon from "argon2";
const nodemailer = require("nodemailer");

interface ResetPasswordRequest {
  email: string;
}

interface UserValidation {
  id: string;
  createdAt: Date;
  validationType: "mail";
  validationToken: string;

  user: User;
  userId: String;
}
interface Session {
  id: String;
  sessionToken: String;
  userId: String;
}

interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  session_state: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  emailVerified: Date;
  image: string;
  validation: UserValidation;
  accounts: Account[];
  sessions: Session[];
}

export async function sendResetPasswordEmail(mail: string) {
  console.log("giiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiirdi");
  console.log(mail);
  const user = await prisma.user.findUnique({ where: { email: mail } });
  console.log(user, "================>xdxdxd");

  if (user) {
    const email = user.email;
    const name = user.name;
    const code: string = humanReadableNanoid(6);

    await prisma.userValidation.upsert({
      where: {
        validationType_userId: {
          userId: user.id,
          validationType: "PASSWORD",
        },
      },
      create: {
        validationToken: code,
        userId: user.id,
        validationType: "PASSWORD",
      },
      update: {
        validationToken: code,
      },
    });

    console.log("data da uservalidate ettti");

    const message = {
      from: process.env.EMAIL_SERVER_USER,
      to: user.email,
      subject: "şifremi unuttum",
      text: "şifre unutuldu",
      html: `<p>${"asd"}</p>`,
    };

    console.log("if mesaj oluşturdu girdi");

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "emine176gumus@gmail.com",
        pass: "xsmtpsib-6b399283cc8fab302a57df7fe8e0b169e3fb4db8b614dd11c9298f3c81b81051-yDQd4wY7ZtvJT85N",
      },
    });

    console.log("if transporter yaptık girdi");

    await transporter.sendMail(message);
    console.log("if sözde göderdi girdi");

    return "ok";
  }
  if (!user) {
    return "notOk";
  }
}

export async function createPasswordVerify(
  email: string,
  code: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
    rejectOnNotFound: true,
  });

  const validation = await prisma.userValidation.findFirst({
    where: {
      userId: user.id,
      validationType: "PASSWORD",
      validationToken: code,
    },
  });

  if (!validation) {
    console.log("hata");
    return "hata";
  }

  const newPassword = await argon.hash(password);

  await prisma.user.update({
    where: { email: email },
    data: {
      password: newPassword,
      verified: true,
    },
  });

  await prisma.userValidation.delete({ where: { id: validation.id } });

  return "OK";
}
