import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthGuard from "./guards/AuthGuard"
import GuestGuard from "./guards/GuestGuard"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Courses from "./pages/Courses"
import Halls from "./pages/Halls"
import ModelHall from "./pages/ModelHall"
import { PageLayout } from "./routes"
import Users from "./pages/Users"
import { SelectModeContextProvider } from "./context/SelectContext"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/dashboard"
					element={
						<AuthGuard>
							<PageLayout />
						</AuthGuard>
					}
				>
					<Route index element={<Navigate replace to="app" />} />
					<Route path="app" element={<Home />} />
					<Route path="halls" element={<Halls />} />
					<Route path="courses" element={<Courses />} />
					<Route path="users" element={<Users />} />
				</Route>
				<Route
					path="/"
					element={
						<GuestGuard>
							<Login />
						</GuestGuard>
					}
				/>
				<Route
					path="/model_hall"
					element={
						<AuthGuard>
							<SelectModeContextProvider>
								<ModelHall />
							</SelectModeContextProvider>
						</AuthGuard>
					}
				/>
				<Route
					path="/model_hall/:hall_id"
					element={
						<AuthGuard>
							<SelectModeContextProvider>
								<ModelHall />
							</SelectModeContextProvider>
						</AuthGuard>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
