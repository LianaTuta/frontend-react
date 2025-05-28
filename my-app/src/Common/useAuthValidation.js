import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const useAuthValidation = () => {
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
      }
    } catch (e) {
      localStorage.removeItem("bearer");
      navigate("/login");
    }
  }, []);
};

export default useAuthValidation;
