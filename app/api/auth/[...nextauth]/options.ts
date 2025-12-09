import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userDetails from "@/model/userDetails";
import blockAdminDetails from "@/model/blockAdminDetails";
import gpAdminDetails from "@/model/gpAdminDetails";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        adminType: { label: "adminType", type: "text" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        // console.log(credentials);
        // const hashedPassword = await bcrypt.hash("12345678", 10);
        // console.log(hashedPassword);

        try {
          if (credentials.adminType == "block") {
            let user: any = await blockAdminDetails.findOne({
              // The 'email' field inside *any* object in the 'blockCredentials' array
              "blockCredentials.email": {
                // Check if the email is one of the target values
                $in: [
                  credentials.email,
                  // ... any other emails you want to check for
                ],
              },
            });
            let password_user = user?.blockCredentials.filter((e:any) => {
              return e.email == credentials.email;
            });

            user.blockCredentials = password_user;
            // console.log(user);

            if (!user || user.blockCredentials.length == 0) {
              throw new Error("No user found with this cradential");
            }

            // if (!user.isVerified) {
            //   throw new Error('Please verify your account before logging in');
            // }
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.blockCredentials[0].password
            );
            if (isPasswordCorrect) {
              // console.log("::::",user);

              return { user, typeAdmin: "block" };
            } else {
              throw new Error("Incorrect password");
            }
          }
          if (credentials.adminType == "gp") {
            let user: any = await gpAdminDetails.findOne({
              // The 'email' field inside *any* object in the 'blockCredentials' array
              "gpCredentials.email": {
                // Check if the email is one of the target values
                $in: [
                  credentials.email,
                  // ... any other emails you want to check for
                ],
              },
            });
            let password_user = user?.gpCredentials.filter((e:any) => {
              return e.email == credentials.email;
            });

            user.gpCredentials = password_user;
            // console.log(user);

            if (!user || user.gpCredentials.length == 0) {
              throw new Error("No user found with this cradential");
            }

            // if (!user.isVerified) {
            //   throw new Error('Please verify your account before logging in');
            // }
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.gpCredentials[0].password
            );
            if (isPasswordCorrect && user.gpCredentials[0].access) {
              // console.log("::::",user);

              return { user, typeAdmin: "gp" };
            } else {
              throw new Error("Incorrect password");
            }
          }
          if (credentials.adminType == "regular") {
            const user:any = await userDetails.findOne(
              { email: credentials.email }
           );
          // console.log(user);
          
          if (!user) {
            throw new Error('No user found with this cradential');
          }
 const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
           if (isPasswordCorrect) {
       return { user, typeAdmin: "regular" };
          } else {
            throw new Error('Incorrect password');
          }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: <any>{
    async jwt({ token, user }: any) {
      // console.log(">>>", user);
      if (user?.typeAdmin == "block") {
        token._id = user.user._id?.toString(); // Convert ObjectId to string
        token.blockName = user.user.blockName;
        token.email = user.user.blockCredentials[0].email;
        token.admin_id = user.user.blockCredentials[0]._id?.toString();
        token.typeAdmin = "block";
      }
      if (user?.typeAdmin == "gp") {
        token._id = user.user._id?.toString(); // Convert ObjectId to string
        token.gpName = user.user.gpName;
        token.email = user.user.gpCredentials[0].email;
        token.admin_id = user.user.gpCredentials[0]._id?.toString();
        token.typeAdmin = "gp";
      }
      if (user?.typeAdmin == "regular") {
        token.admin_id = user.user._id?.toString(); // Convert ObjectId to string
        token.name = user.user.name;
        token.mobile = user.user.mobile;
        token.email = user.user.email;
        // token.admin_id = user.user.gpCredentials[0]._id?.toString();
        token.typeAdmin = "regular";
      }
      return token;
    },
    async session({ session, token }: any) {
      // console.log(">>>>><<<<<<",token);
      if (token && token?.typeAdmin == "block") {
        
        session.user._id = token._id;
        session.user.typeAdmin = token.typeAdmin;
        session.user.email = token.email;
        session.user.admin_id = token.admin_id;
        session.user.blockName = token.blockName;
      }
      if (token && token?.typeAdmin == "gp") {
        session.user._id = token._id;
        session.user.typeAdmin = token.typeAdmin;
        session.user.email = token.email;
        session.user.admin_id = token.admin_id;
        session.user.gpName = token.gpName;
      }
      if (token && token?.typeAdmin == "regular") {
        // session.user._id = token._id;
        session.user.typeAdmin = token.typeAdmin;
        session.user.email = token.email;
        session.user.admin_id = token.admin_id;
        session.user.name = token.name;
        session.user.mobile = token.mobile;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
