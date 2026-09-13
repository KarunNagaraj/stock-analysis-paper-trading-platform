import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import type {
    LoginInput,
    RegisterInput,
    User,
} from "../../types/auth";

import {
    getCurrentUser,
    login as loginRequest,
    register as registerRequest,
} from "../../services/authService";

import {
    getToken,
    removeToken,
    setToken,
} from "../../services/authStorage";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
}
//createContext() creates a shared container called AuthContext. AuthContext.Provider is the component that puts a value into that container and makes it available to all components inside it. In our case, the value is an object containing user, isLoading, login, register, and logout.
const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreUser(): Promise<void> {
            const token = getToken();

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch {
                removeToken();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        restoreUser();
    }, []);

    async function login(input: LoginInput): Promise<void> {
        const response = await loginRequest(input);

        setToken(response.token);
        setUser(response.user);
    }

    async function register(
        input: RegisterInput
    ): Promise<void> {
        const response = await registerRequest(input);

        setToken(response.token);
        setUser(response.user);
    }

    function logout(): void {
        removeToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext); //useContext(AuthContext) allows a component to retrieve the value currently provided by AuthContext.

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return context;
}

/*React Context is a way to share data with multiple components without manually passing it through every component as props. 
createContext() creates a shared container called AuthContext. AuthContext.Provider is the component that puts a value into that container and makes it available to all components inside it. 
In our case, the value is an object containing user, isLoading, login, register, and logout.

children simply refers to whatever components are placed inside another component. 
So when we eventually write <AuthProvider><App /></AuthProvider>, <App /> is the children of AuthProvider. children: ReactNode is just TypeScript saying that the children can be any valid React content. 
useContext(AuthContext) allows a component to retrieve the value currently provided by AuthContext. 
Finally, useAuth() is our own convenient wrapper around useContext(AuthContext), allowing components to simply write const { user, logout } = useAuth() instead of directly dealing with the Context.

The responsibility of this file is:
Store the currently authenticated user
Store whether authentication is still being checked (isLoading)
Provide login()
Provide register()
Provide logout()
Later, restore the user from /auth/me*/