import dbConnect from "@/lib/dbConnect";
import otpManage from "@/model/userOtpManage";
import userDetails from "@/model/userDetails";
import bcrypt from "bcryptjs";
import gpAdminDetails from "@/model/gpAdminDetails";

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
  const { gp_id, email, password } = body;
  // console.log(body);

  if (!gp_id || !email || !password ) {
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
       const checkgp = await gpAdminDetails.findOne({ _id:gp_id });
    const result = await gpAdminDetails.findOne({
      "gpCredentials.email": email,
    });

     if (!checkgp) {
       return new Response(
        JSON.stringify({
          success: false,
          message: "No gp found in that cradentials !!",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
     if (result) {
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
        const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
      const newCredential = {
          email,
          password: hashpassword,
        };

    const hashedPassword = await bcrypt.hash(password, 10);
      const updatedDocument = await gpAdminDetails.findOneAndUpdate(
          { _id: checkgp._id },
          { $push: { gpCredentials: newCredential } },
          { new: true, runValidators: true } // Return the updated document and run schema validators
        );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cradential updated successfully .",
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
