import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        let existingUser = await User.findOne({
          email: user.email,
        });

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,

            provider: "google",

            googleId: account.providerAccountId,

            image: user.image,

            role: "student",
          });
        } else {
          existingUser.googleId =
            account.providerAccountId;

          existingUser.provider = "google";

          existingUser.image = user.image;

          await existingUser.save();
        }

        return true;
      } catch (error) {
        console.log(error);

        return false;
      }
    },

    async jwt({ token }) {
      return token;
    },

    async session({ session }) {
      return session;
    },
  },
};