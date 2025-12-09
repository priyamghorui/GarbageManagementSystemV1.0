import dbConnect from "@/lib/dbConnect";
import otpManage from "@/model/userOtpManage";
import userDetails from "@/model/userDetails";
import bcrypt from "bcryptjs";

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

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name, email, mobile, password, otp, otpId } = body;
  // console.log(body);

  if (!name || !email || !password || !mobile || !otp || !otpId) {
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
    // Check if user already exists
    const existingUser = await userDetails.findOne({ email: email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Same username or email alredy exist !!",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userDetails({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
    await newUser.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account registered successfully , You Can now Long In.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
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
