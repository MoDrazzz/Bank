import { createContext, FC, ReactNode, useContext, useReducer } from "react";

type AuthActions = "LOGIN" | "LOGOUT";

interface Props {
  children: ReactNode;
}

type ReducerState = User | null;

type ReducerAction = { type: AuthActions; payload: User | null };

interface AuthContextValues {
  user: ReducerState;
  dispatch: React.Dispatch<ReducerAction>;
}

const AuthenticationContext = createContext<AuthContextValues>({
  user: null,
  dispatch: () => {},
});

const authReducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case "LOGIN": {
      return action.payload;
    }
    case "LOGOUT": {
      return null;
    }
  }
};

const AuthContext: FC<Props> = ({ children }) => {
  const [user, dispatch] = useReducer(authReducer, null);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        dispatch,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthContext = () => {
  const values = useContext(AuthenticationContext);

  return values;
};

export default AuthContext;
