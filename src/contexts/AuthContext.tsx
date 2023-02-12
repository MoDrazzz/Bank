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
  cards: Card[];
  setCards: React.Dispatch<SetStateAction<Card[]>>;
  operations: Operation[];
  setOperations: React.Dispatch<SetStateAction<Operation[]>>;
}

const AuthenticationContext = createContext<AuthContextValues>({
  user: null,
  dispatchUser: () => {},
  cards: [],
  setCards: () => {},
  operations: [],
  setOperations: () => {},
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
  const [cards, setCards] = useState<Card[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        dispatchUser,
        cards,
        setCards,
        operations,
        setOperations
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
