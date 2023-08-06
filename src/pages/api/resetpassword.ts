import { NextApiRequest, NextApiResponse } from "next";
import { createPasswordVerify } from "~/server/resetPassword";

export default async function resetPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = createPasswordVerify(
    req.body.email,
    req.body.code,
    req.body.password
  );
  console.log(data, "==============>");

  return res.status(200).json("oks");
}
