import dbConnect from "@/lib/dbConnect";
import userDetails from "@/model/userDetails";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import otpManage from "@/model/userOtpManage";
import nodemailer from "nodemailer";
// export async function GET(request: Request) {
//   // For example, fetch data from your DB here
//   const users = [
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' }
//   ];
//   return new Response(JSON.stringify(users), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER_GMAIL,
    pass: process.env.MAIL_SENDER_KEY, // use Gmail App Password
  },
});
async function sendMail(to: any, subject: any, text: any) {
  await transporter.sendMail({
    from: '"Garbage Management System" <ghoruimiit2018@gmail.com>',
    to,
    subject,
    html: text,
  });
}
export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { email } = body;
  // console.log(body);

  if (!email) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid cradentials" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await dbConnect();

    // Check if user already exists
    const existingUser = await userDetails.findOne({
      email: email,
    });
    // console.log(">>",existingUser);
    if (!existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email does not exist !!",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const saveData = await otpManage.create({
      email,
      otp,
    });
    // const saveData = new otpManage({
    //   email,
    //   otp,
    // });
    //  await saveData.save();
    const subject = "Your One-Time Password (OTP) for Varification";
    const message = `
<div style="max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    
    <div style="background-color: #17a2b8; padding: 25px 30px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">
            🔑 Application Security GMS (Singur BDO)
        </h1>
    </div>

    <div style="padding: 30px; color: #343a40;">
        <p style="font-size: 16px; line-height: 1.6;">
            Hello ${email},
        </p>
        
        <p style="font-size: 16px; line-height: 1.6;">
            You requested for Create a Account in Garbage Management System for that , this a one-time code to verify your identity. Please enter the following **4-digit code** to complete your action:
        </p>
        
        <div style="text-align: center; margin: 35px 0; padding: 20px; border: 2px dashed #ffc107; background-color: #fff3cd; border-radius: 8px;">
            <p style="font-size: 16px; color: #343a40; margin-bottom: 5px; font-weight: 500;">
                One-Time Password
            </p>
            <h2 style="color: #17a2b8; margin: 5px 0; font-size: 42px; letter-spacing: 10px; font-weight: 700;">
                <span style="display: inline-block; padding: 0 5px;">${otp}</span> </h2>
        </div>

        <p style="font-size: 14px; color: #dc3545; margin-top: 25px; font-weight: 500;">
            ⚠️ **This code is valid for 10 minutes.** For security, please do not share this code with anyone.
        </p>

        <p style="font-size: 14px; color: #6c757d; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email. Your account is secure.
        </p>
    </div>

    <div style="padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center; background-color: #f8f9fa; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
        <p style="font-size: 12px; color: #6c757d; margin: 0;">
            &copy; ${new Date().getFullYear()} GMS.
        </p>
    </div>

</div>
            `;
    await sendMail(email, subject, message);
    return new Response(
      JSON.stringify({
        success: true,
        otpId: saveData?._id,
        message: "OTP sent successfully! Check your email.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // console.log(error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "server error !!",
        error,
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}