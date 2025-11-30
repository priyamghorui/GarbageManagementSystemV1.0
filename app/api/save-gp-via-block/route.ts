import dbConnect from "@/lib/dbConnect";
import gpAdminDetails from "@/model/gpAdminDetails";

import userDetails from "@/model/userDetails";

import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { gpName, email, password, gpHead } = body;
  // console.log(body);

  if (!gpName || !email || !password || !gpHead) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid details" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await dbConnect();
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const checkgp = await gpAdminDetails.findOne({ gpName });
    const result = await gpAdminDetails.findOne({
      "gpCredentials.email": email,
    });
    if (result) {
      return new Response(
        JSON.stringify({ success: false, message: "Already used Email Id !!" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (checkgp) {
      return new Response(
        JSON.stringify({ success: false, message: "Gp Already Created !!" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    await gpAdminDetails.create({
      gpName,
      gpHead,
      gpCredentials: [{ email, password: hashpassword }],
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Gp successfully uploaded!!",
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
