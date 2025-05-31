import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../constants/roleEnum"; 


export const useIsManagerValid = () => {
  const token = localStorage.getItem("bearer");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.removeItem("bearer");
      return false;
    }

    const userRole = decoded.role?.toString().toLowerCase();
    return userRole === "manager";
  } catch (e) {
    localStorage.removeItem("bearer");
    return false;
  }
};


const useAuthValidation = (requiredRole = null) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("bearer");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        localStorage.removeItem("bearer");
        navigate("/login");
        return;
      }

      if (requiredRole !== null) {
        const userRole = decoded.role?.toString().toLowerCase();
        
        const requiredRoleName = Object.entries(Roles)
          .find(([, value]) => value === requiredRole)?.[0]
          ?.toLowerCase();
      
        if (userRole !== requiredRoleName) {
          navigate("/all-events");
          return;
        }
      }
      
    } catch (e) {
      localStorage.removeItem("bearer");
      navigate("/login");
    }
  }, [navigate, requiredRole]);
};


export default useAuthValidation;
