import * as React from "react";

interface IAuth extends IAdminUsers {}

interface IContext {
  user: Partial<IAuth>| null;
  setUser: React.Dispatch<React.SetStateAction<Partial<IAuth> | null>>;
}

const AuthContext = React.createContext<IContext | null>(null)

const AuthProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<Partial<IAuth> | null>(null); // needed for setting the user instead of relying on data alone. this is much faster 
  /* const { data, isLoading, error } = useQuery({
    queryKey: ["user-session"], 
    queryFn: () => {} // to follow later 
  }) */
  return <AuthContext.Provider value={{
    user, 
    setUser, 
  }}>
  {children}
  </AuthContext.Provider>
}

const useAuthContext = (): IContext => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthContext } 