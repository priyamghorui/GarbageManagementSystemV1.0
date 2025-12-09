import dbConnect from "@/lib/dbConnect";
import beneficiaryDetails from "@/model/beneficiaryDetails";
import gpAdminDetails from "@/model/gpAdminDetails";
import userComplaintsDetails from "@/model/userComplaintsDetails";

import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { _id,changeTo } = body;
  // console.log(body);

  if (!_id||!changeTo) {
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
    await userComplaintsDetails.findByIdAndUpdate(_id, {
      $set: { status: changeTo },
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "successfully updated.",
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
