import { createContext, FC, ReactNode, useContext, useReducer } from "react";

export enum authActions {
  login = "LOGIN",
  logout = "LOGOUT",
}

interface Props {
  children: ReactNode;
}

type ReducerState = User | null;

interface ReducerAction {
  type: authActions;
  payload: User;
}

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
    case authActions.login: {
      return action.payload;
    }
    case authActions.logout: {
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
