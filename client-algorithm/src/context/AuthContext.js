import { createContext, useEffect, useReducer } from "react";
import { isValidToken, setSession } from "../utils/jwt";

import axios from "../utils/axios";

const initialState = {
	isAuthenticated: false,
	isInitialized: false,
	user: null,
};

const handlers = {
	INITIALIZE: (state, action) => {
		const { isAuthenticated, user } = action.payload;

		return {
			...state,
			isAuthenticated,
			isInitialized: true,
			user,
		};
	},

	LOGIN: (state, action) => {
		const { user } = action.payload;
		return {
			...state,
			isAuthenticated: true,
			user,
		};
	},
	LOGOUT: (state) => ({
		...state,
		isAuthenticated: false,
		user: null,
	}),
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
	...initialState,
	login: Promise.resolve(),
	logout: Promise.resolve(),
});

function AuthProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const initialize = async () => {
			try {
				const accessToken = window.localStorage.getItem("accessToken");
				if (accessToken && isValidToken(accessToken)) {
					setSession(accessToken);
					const response = await axios.get("/api/v1/profile");
					const { user } = response?.data;

					dispatch({
						type: "INITIALIZE",
						payload: {
							isAuthenticated: true,
							user,
						},
					});
				} else {
					dispatch({
						type: "INITIALIZE",
						payload: {
							isAuthenticated: false,
							user: null,
						},
					});
				}
			} catch (error) {
				dispatch({
					type: "INITIALIZE",
					payload: {
						isAuthenticated: false,
						user: null,
					},
				});
			}
		};
		initialize();
	}, []);

	const login = async (email, password) => {
		const response = await axios.post("/api/v1/login", {
			email,
			password,
		});

		const { accessToken, user } = response.data;
		setSession(accessToken);
		dispatch({
			type: "LOGIN",
			payload: {
				user,
			},
		});
	};

	const logout = async () => {
		setSession(null);
		dispatch({ type: "LOGOUT" });
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthContext, AuthProvider };
