import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ApiResponse, RegisterData, User } from "../utils/models";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  registerWithEmailAndPassword: (data: RegisterData) => Promise<ApiResponse>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setIsAuthenticated(true);
  };

  const registerWithEmailAndPassword = async (
    data: RegisterData
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setUser({
          name: data.name,
          email: data.email,
          id: responseData.userId,
        });

        setIsAuthenticated(true);

        return {
          message: responseData.message,
          result: true,
          data: responseData,
        } as ApiResponse;
      } else {
        return {
          message: "An error occurred, please try again later ",
          result: false,
        } as ApiResponse;
      }
    } catch (error) {
      return {
        message: "An error occurred, please try again later",
        result: false,
      } as ApiResponse;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {};
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        registerWithEmailAndPassword,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
