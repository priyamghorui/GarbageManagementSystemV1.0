import dbConnect from "@/lib/dbConnect";
import gpAdminDetails from "@/model/gpAdminDetails";

import userDetails from "@/model/userDetails";

export async function GET(request: Request) {
  try {
    await dbConnect();
    // const result = await notebook.find({ wonerId: _id }).select("-__v");
    const result = await gpAdminDetails
      .find(
        {},
        {
          "gpCredentials.password": 0,
        }
      )
      .select("-createdAt -updatedAt -__v");

    // console.log("result", result);
    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: "ok !!",
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
