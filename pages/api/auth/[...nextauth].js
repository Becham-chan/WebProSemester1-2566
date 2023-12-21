import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import Axios from 'axios';
import MySQL from '@/models/MySQL';

const adminEmails = ['coraditoc@gmail.com', 'becham.can@gmail.com'];

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session,token,user}) => {
      if (adminEmails.includes(session?.user?.email)) {
        let name = user['name'];
        let mail = user['email'];
        // Brute way to get element : console.log(user["name"], user["email"]);
        //axios.post("/api/admin", {name, mail});
        MySQL.connect();
        MySQL.query("Insert into administrator (Admin_name, Admin_email) values (?, ?)", [name, mail], function (err, result, fields) {
          if (err) throw err;
          console.log(result);
        });
        MySQL.end();
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
