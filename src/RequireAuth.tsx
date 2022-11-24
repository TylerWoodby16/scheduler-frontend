import { Navigate } from "react-router-dom";
import jwtDecode, { JwtPayload } from "jwt-decode";

export const RequireAuth = ({ children }: { children: any }) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode<JwtPayload>(token);
  console.log(decodedToken);
  console.log("now: " + Date.now());
  console.log("exp: " + decodedToken.exp);

  if (!decodedToken || !decodedToken.exp) {
    return <Navigate to="/login" />;
  }

  // Check if token is expired.
  const currentTime = Date.now()/1000
  if (currentTime > decodedToken.exp){
    return <Navigate to="/login" />;
  }

  return children;
};
