import { createContext, useEffect, useState } from "react";
import { signInRequest, signUpRequest } from "../services/auth";
import { setCookie, parseCookies, destroyCookie } from "nookies"
import Router from "next/router";
import { recoveryUser } from "../services/user-service";
import { getAPIClient } from "../services/api";

type SignInType = {
  email: string;
  password: string;
}
type SignUpType = {
  name: string;
  email: string;
  password: string;
}

type User = {
  id: string;
  name: string;
  email: string;
  photo: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInType) => Promise<void>;
  signUp: (data: SignUpType) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'auth.token': token } = parseCookies();

    if (token) {
      const _token = JSON.parse(token);
      recoveryUser(_token.id).then(response => setUser(response));

    }
  }, []);

  async function signIn({ email, password }: SignInType) {
    const { token, user } = await signInRequest({
      email,
      password
    });

    handleRedirect(token, user);
  }

  async function signUp({name, email, password}: SignUpType) {
    const { token , user } = await signUpRequest({
      name,
      email,
      password
    });

    handleRedirect(token, user);
  }

  function logout(){
    setUser(null);
    destroyCookie( undefined, 'auth.token')
    Router.push('/login')
  }

  function handleRedirect(token:any, user: any){
    const api = getAPIClient()

    setCookie(undefined, 'auth.token', JSON.stringify(token), {
      maxAge: 60 * 60 * 24 * 7, // 7D
    });

    api.defaults.headers.common['Authorization'] = `Bearer ${token.token}`;

    setUser(user)
    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}