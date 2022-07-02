import { createContext, useEffect, useState } from "react";
import { signInRequest } from "../services/auth";
import { setCookie, parseCookies } from "nookies"
import Router from "next/router";
import { recoveryUser } from "../services/user-service";
import { api } from "../services/api";

type SignInType = {
  email: string;
  password: string;
}

type User = {
  name: string;
  email: string;
  photo: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInType) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'auth.token': token } = parseCookies();
    
    if(token){
      const _token = JSON.parse(token);

      recoveryUser(_token.userId).then(response =>setUser(response));
      
    }
  }, []);

  //Função de login que retorna o token e o usuário do back-end
  async function signIn({ email, password }: SignInType) {
    
    const { token, user } = await signInRequest({
      email,
      password
    });
    
    setCookie(undefined, 'auth.token', JSON.stringify(token), {
      maxAge: 60 * 60 * 24 * 7, // 7D
    });
     
    api.defaults.headers.common['Authorization'] = `Bearer ${token.token}`;

    setUser(user)
    Router.push('/dashboard');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}