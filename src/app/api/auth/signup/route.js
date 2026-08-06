import {connectDB} from "@/lib/db";
import User from "../../../../models/user"
import bcrypt from "bcrypt";
import {createRefreshToken,createAccessToken} from "@/lib/jwt";
import {NextResponse} from "next/server";


export async function POST(req){

try{
await connectDB();


const body = await req.json();


const {
name,
email,
mobile,
className,
category,
password
}=body;



const existingUser =
await User.findOne({email});


if(existingUser){

return NextResponse.json(
{
message:"User already exists"
},
{
status:400
}
);

}



const hashedPassword =
await bcrypt.hash(password,10);



const user =
await User.create({

name,
email,
mobile,
className,
category,
password:hashedPassword

});


const accessToken = createAccessToken(user);

const refreshToken = createRefreshToken(user);
console.log("acces token",accessToken);
console.log("refresh token",refreshToken);
user.refreshToken=refreshToken;

await user.save();

const response = NextResponse.json({

message:"Signup successful",

user:{
id:user._id,
name:user.name,
email:user.email
}

});


// access token cookie

response.cookies.set(
"accessToken",
accessToken,
{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"strict",
maxAge:60 * 15,
path:"/"
}
);


// refresh token cookie

response.cookies.set(
"refreshToken",
refreshToken,
{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"strict",
maxAge:60 * 60 * 24 * 7,
path:"/"
}
);


return response;


}
catch(error){

return NextResponse.json(
{
message:error.message
},
{
status:500
}
)

}

}