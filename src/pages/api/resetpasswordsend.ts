import { sendResetPasswordEmail } from "~/server/resetPassword";

const nodemailer = require("nodemailer");

//@ts-ignore
export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("girdissssssssssssssssssssssss");
    console.log(req.body.mail);
    //@ts-ignore
    const data = await sendResetPasswordEmail(req.body.mail);

    console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaaaaa");

    if (data == "ok") {
      res.status(200).json("mail gönderildi");
    } else {
      res.status(404).json("başarısız");
    }
  } else {
    res.status(404).json("başarısız");
  }
}
