import React from "react"
import SideNav from "./SideNav"
import AppBar from "./AppBar"
import { Outlet } from "react-router-dom"

const PageLayout = () => {
	return (
		<div className="flex h-screen overflow-hidden">
			<div className="hidden md:block">
				<SideNav />
			</div>
			<div className="h-full flex-1 overflow-hidden bg-[#f8f9f8]">
				<AppBar />
				<div className="h-full overflow-auto md:px-4">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default PageLayout
