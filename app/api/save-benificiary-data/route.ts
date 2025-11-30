import dbConnect from "@/lib/dbConnect";
import beneficiaryDetails from "@/model/beneficiaryDetails";
import gpAdminDetails from "@/model/gpAdminDetails";

import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const {
    gp_id,
    uploadedBy,
    panchayet,
    ward,
    residentialAddress,
    headOfTheFamilyName,
    sex,
    age,
    aadhaarNumber,
    phoneNumber,
    occupation,
    assistanceTakenFromGovernment,
    hasCertificate,
    isCaste,
    caste,
  } = body;
  // console.log(body);

  if (!uploadedBy || !gp_id) {
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
    await beneficiaryDetails.create({
      gp_id,
      uploadedBy,
      panchayet,
      ward,
      residentialAddress,
      headOfTheFamilyName,
      sex,
      age,
      aadhaarNumber,
      phoneNumber,
      occupation,
      assistanceTakenFromGovernment,
      hasCertificate,
      isCaste,
      caste,
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "successfully uploaded!!",
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
