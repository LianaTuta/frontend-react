import { jwtDecode } from "jwt-decode";
import { Roles } from "../constants/roleEnum";

class AuthHelper {
  static getToken() {
    return localStorage.getItem("bearer");
  }

  static getDecodedToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  static isLoggedIn() {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
  }

  static hasRole(requiredRole) {
    const token = localStorage.getItem("bearer");
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;
  
      if (typeof userRole === "string") {
        const normalized = userRole.toLowerCase();
        if (requiredRole === Roles.MANAGER && normalized === "manager") return true;
        if (requiredRole === Roles.CUSTOMER && normalized === "customer") return false;
      }
  
      return false;
    } catch {
      return false;
    }
  }

  static logout() {
    localStorage.removeItem("bearer");
  }
}

export default AuthHelper;
