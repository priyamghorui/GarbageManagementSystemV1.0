import dbConnect from "@/lib/dbConnect";
import beneficiaryDetails from "@/model/beneficiaryDetails";
import gpAdminDetails from "@/model/gpAdminDetails";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await dbConnect();
    // console.log(id);
    
    if (id) {
      const totalBenificiaryGp = await beneficiaryDetails.countDocuments({
        gp_id: id,
      });
      return new Response(
        JSON.stringify({
          success: true,
          data: { totalBenificiaryGp },
          message: "ok !!",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // const result = await notebook.find({ wonerId: _id }).select("-__v");
    const totalGps = await gpAdminDetails.countDocuments({});
    const totalBenificiary = await beneficiaryDetails.countDocuments({});

    // console.log("result", result);
    return new Response(
      JSON.stringify({
        success: true,
        data: { totalGps, totalBenificiary },
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
