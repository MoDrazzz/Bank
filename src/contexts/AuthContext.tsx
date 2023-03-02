import {
  createContext,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useReducer,
  useState,
} from "react";

type AuthActions = "LOGIN" | "LOGOUT";

interface Props {
  children: ReactNode;
}

type ReducerState = User | null;

type ReducerAction = { type: AuthActions; payload: User | null };

interface AuthContextValues {
  user: ReducerState;
  dispatchUser: React.Dispatch<ReducerAction>;
  activeAccount: Account | null;
  setActiveAccount: React.Dispatch<Account>;
}

const AuthenticationContext = createContext<AuthContextValues>({
  user: null,
  dispatchUser: () => {},
  activeAccount: null,
  setActiveAccount: () => {},
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
  const [user, dispatchUser] = useReducer(authReducer, null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        dispatchUser,
        activeAccount,
        setActiveAccount,
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
