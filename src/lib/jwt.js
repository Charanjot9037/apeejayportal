import jwt from "jsonwebtoken";

export function createAccessToken(user){

return jwt.sign(
{
 id:user._id,
 email:user.email
},
process.env.JWT_ACCESS_SECRET,
{
 expiresIn:"15m"
}
);

}



export function createRefreshToken(user){

return jwt.sign(
{
 id:user._id
},
process.env.JWT_REFRESH_SECRET,
{
 expiresIn:"7d"
}
);

}
const RESET_TOKEN_SECRET = process.env.JWT_RESET_SECRET;

export function createPasswordResetToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      type: "password-reset",
    },
    RESET_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
}
export function verifyPasswordResetToken(token) {
  return jwt.verify(token, RESET_TOKEN_SECRET);
}