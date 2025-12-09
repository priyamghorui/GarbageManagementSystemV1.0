import dbConnect from "@/lib/dbConnect";
import userComplaintsDetails from "@/model/userComplaintsDetails";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { specificLocation, gp, description, userId, img, public_id } = body;
  //   console.log(body);

  if (
    !specificLocation ||
    !gp ||
    !description ||
    !userId ||
    !img ||
    !public_id
  ) {
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
    await userComplaintsDetails.create({
      specificLocation,
      gp,
      description,
      userId,
      img,
      public_id,
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Complaint successfully uploaded.",
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
