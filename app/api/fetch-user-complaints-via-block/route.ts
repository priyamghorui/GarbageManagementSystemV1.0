import dbConnect from "@/lib/dbConnect";
import userComplaintsDetails from "@/model/userComplaintsDetails";

export async function GET(request: Request) {
  try {
    // const { searchParams } = new URL(request.url);
    // const gpName = searchParams.get("gpName");
    await dbConnect();
    // const result = await notebook.find({ wonerId: _id }).select("-__v");

      const result = await userComplaintsDetails
        .find({})
        .select("-__v");
      // console.log(result);

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
