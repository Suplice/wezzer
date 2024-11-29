import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ApiResponse, LoginData, RegisterData, User } from "../utils/models";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  registerWithEmailAndPassword: (data: RegisterData) => Promise<ApiResponse>;
  signInWithEmailAndPassword: (data: LoginData) => Promise<ApiResponse>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
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

  const signInWithEmailAndPassword = async (data: LoginData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/login`,
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
          name: responseData.user.Nickname,
          email: data.email,
          id: responseData.user.UserId,
        });

        console.log({
          name: responseData.user.Nickname,
          email: data.email,
          id: responseData.user.UserId,
        });
        setIsAuthenticated(true);

        return {
          message: responseData.message,
          result: true,
          data: responseData,
        } as ApiResponse;
      } else {
        console.error(responseData);
        return {
          message: responseData.error,
          result: false,
        } as ApiResponse;
      }
    } catch (error) {
      console.error(error);
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
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DJANGO_URL}/api/checkCredentials`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseData = await response.json();

        console.log(responseData);

        if (response.ok) {
          setUser({
            name: responseData.user.Nickname,
            email: responseData.user.Email,
            id: responseData.user.UserId,
          });

          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    console.log(isAuthenticated);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        registerWithEmailAndPassword,
        signInWithEmailAndPassword,
        user,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
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
