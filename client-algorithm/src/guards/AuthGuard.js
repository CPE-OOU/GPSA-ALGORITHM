import React, { useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import Loader from "../components/Loader"
import useAuth from "../hooks/useAuth"
import { Login } from "../routes"

export default function AuthGuard({ children }) {
	const { isAuthenticated, isInitialized } = useAuth()

	const { pathname } = useLocation()
	const [requestLocation, setRequestLocation] = useState(null)

	if (!isInitialized) {
		return <Loader open={true} />
	}

	if (!isAuthenticated) {
		if (pathname !== requestLocation) {
			setRequestLocation(pathname)
		}
		return <Login />
	}

	if (requestLocation && pathname !== requestLocation) {
		setRequestLocation(null)
		return <Navigate to={requestLocation} />
	}

	return <> {children} </>
}
