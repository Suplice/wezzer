import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ApiResponse, LoginData, RegisterData, User } from "../utils/models";
import Loading from "../Pages/Loading/Loading";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<ApiResponse>;
  registerWithEmailAndPassword: (data: RegisterData) => Promise<ApiResponse>;
  signInWithEmailAndPassword: (data: LoginData) => Promise<ApiResponse>;
  user: User | null;
  signInAsGuest: () => Promise<ApiResponse>;
  signOutAsGuest: () => Promise<ApiResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setIsAuthenticated(true);
  };

  const registerWithEmailAndPassword = async (
    data: RegisterData
  ): Promise<ApiResponse> => {
    if (isAuthenticated) {
      return {
        message: "You are already signed in",
        result: false,
      } as ApiResponse;
    }
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

  const signOutAsGuest = async () => {
    setIsAuthenticated(false);
    setUser(null);

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/signOutAsGuest/${user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        return {
          message: responseData.message,
          result: true,
          data: responseData,
        } as ApiResponse;
      } else {
        console.error(responseData);
        return {
          message: responseData.message,
          result: true,
          data: responseData,
        } as ApiResponse;
      }
    } catch (error) {
      console.error(error);
      return {
        message: "An error occurred, please try again later",
        result: false,
      } as ApiResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsGuest = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/signInAsGuest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        setUser({
          name: responseData.name,
          email: responseData.email,
          id: responseData.userId,
          guest: true,
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
          message: responseData.message,
          result: true,
          data: responseData,
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

  const signInWithEmailAndPassword = async (data: LoginData) => {
    if (isAuthenticated) {
      return {
        message: "You are already signed in",
        result: false,
      } as ApiResponse;
    }
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
        setIsAuthenticated(true);

        return {
          message: responseData.message,
          result: true,
          data: responseData,
        } as ApiResponse;
      } else {
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

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        return {
          message: "Logged out successfully",
          result: true,
        } as ApiResponse;
      }
    } catch (error) {
      return {
        message: "An error occurred, please try again later",
        result: false,
      } as ApiResponse;
    } finally {
      setIsLoading(false);
    }
    return {
      message: "An error occurred, please try again later",
      result: false,
    } as ApiResponse;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
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

        if (response.ok) {
          setUser({
            name: responseData.user.Nickname,
            email: responseData.user.Email,
            id: responseData.user.UserId,
            guest: responseData.guest,
          });

          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signOutAsGuest,
        signInAsGuest,
        isAuthenticated,
        login,
        logout,
        registerWithEmailAndPassword,
        signInWithEmailAndPassword,
        user,
      }}
    >
      {isLoading ? <Loading /> : children}
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
