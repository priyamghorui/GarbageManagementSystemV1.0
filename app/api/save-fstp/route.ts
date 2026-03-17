import dbConnect from "@/lib/dbConnect";
import userComplaintsDetails from "@/model/userComplaintsDetails";
import userFstpDetails from "@/model/userFstpDetails";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name,contact,location,gp,choiceOfDate,userId } = body;

  if (
    !name ||
    !userId ||
    !contact ||
    !location ||
    !gp ||
    !choiceOfDate 
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
    await userFstpDetails.create({
     name,contact,location,gp,choiceOfDate,userId
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "FSTP Successfully Registered, Go To Dashboard To Track Details.",
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
