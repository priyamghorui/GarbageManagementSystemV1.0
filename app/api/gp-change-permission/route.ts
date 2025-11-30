import dbConnect from "@/lib/dbConnect";
import gpAdminDetails from "@/model/gpAdminDetails";

import userDetails from "@/model/userDetails";

import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { gp_id, userId } = body;
  // console.log(body);

  if (!gp_id || !userId) {
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
    const document:any = await gpAdminDetails.findOne(
      {
        _id: gp_id,
        "gpCredentials._id": userId,
      },
      {
        // Projection to return only the credential that matched the email
        "gpCredentials.$": 1,
      }
    );
    // console.log(document);

    // console.log(document.gpCredentials[0].access);

    const updatedDocument = await gpAdminDetails.findOneAndUpdate(
      {
        _id: gp_id,
        "gpCredentials._id": userId,
      },
      {
        $set: {
          "gpCredentials.$.access":
            document.gpCredentials[0].access == false ? true : false,
        },
      },
      {
        new: true, // Returns the modified document rather than the original
        runValidators: true, // Runs schema validators on the updated data
      }
    );
    if (updatedDocument) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Permission changed!!",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Not found!!!!",
      }),
      {
        status: 401,
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
