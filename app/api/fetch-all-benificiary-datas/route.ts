import dbConnect from "@/lib/dbConnect";
import gpAdminDetails from "@/model/gpAdminDetails";
import beneficiaryDetails from "@/model/beneficiaryDetails";

import userDetails from "@/model/userDetails";

export async function GET(request: Request) {
  try {
    await dbConnect();
    // const result = await notebook.find({ wonerId: _id }).select("-__v");
    const result = await beneficiaryDetails.aggregate([
      // Stage 1: Group the documents by 'gp_id'
      {
        $group: {
          _id: "$gp_id", // The grouped ObjectId
          forms: {
            $push: "$$ROOT",
          },
          formsSubmitted: { $sum: 1 },
        },
      },

      // Stage 2: Join the grouped result with the 'gpAdminDetails' collection
      {
        $lookup: {
          from: "gpadmindetails", // <--- CRITICAL: Use the actual MongoDB collection name
          localField: "_id", // This is the grouped gp_id (an ObjectId)
          foreignField: "_id", // This is the _id field in the gpadmindetails collection
          as: "gp_details",
        },
      },

      // Stage 3: Deconstruct the 'gp_details' array
      // Use 'preserveNullAndEmptyArrays: true' to ensure groups with no match are still included.
      {
        $unwind: {
          path: "$gp_details",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Stage 4: Project the final output structure
      {
        $project: {
          _id: 0,
          gp_id: "$_id", // Keep the gp_id
          forms: "$forms",
          // Extract the required fields from the joined document
          gpName: "$gp_details.gpName",
          gpHead: "$gp_details.gpHead",
          formsSubmitted: 1,
        },
      },
    ]);
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
