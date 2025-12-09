import dbConnect from "@/lib/dbConnect";
import userDetails from "@/model/userDetails";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import otpManage from "@/model/userOtpManage";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { email, otpId, otp, password } = body;
  // console.log(body);

  if (!email || !otp || !otpId) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid cradentials" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await dbConnect();
    const userOtp = await otpManage.findOne({ _id: otpId });

    if (!userOtp || userOtp.otp != otp) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "OTP does not match !!",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (!password) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "OTP matched Successfully !!",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const retult = await userDetails.findOneAndUpdate(
      {
        email: email,
      },
      { $set: { password: hashedPassword } }
    );
  
    return new Response(
      JSON.stringify({
        success: true,
        message: "Your Password Successfully Reset.",
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