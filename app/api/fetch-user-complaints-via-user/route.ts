import dbConnect from "@/lib/dbConnect";
import userComplaintsDetails from "@/model/userComplaintsDetails";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await dbConnect();
    // const result = await notebook.find({ wonerId: _id }).select("-__v");
    if (id) {
      const result = await userComplaintsDetails
        .find({ userId: id })
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
    }
    return new Response(
      JSON.stringify({
        success: false,
        data: [],
        message: "Not found !!",
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
