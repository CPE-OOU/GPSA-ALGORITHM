import React, { useEffect, useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import { BiTachometer } from "react-icons/bi"
import { NavLink, useNavigation, useLocation } from "react-router-dom"
import { AiOutlineMenu } from "react-icons/ai"
import { IoIosNotificationsOutline } from "react-icons/io"
import Modal from "@mui/material/Modal"
import SideNav from "./SideNav"

const AppBar = () => {
	const [navOpen, setNavOpen] = useState(false)

	const location = useLocation()

	useEffect(() => {
		setNavOpen(false)
	}, [location])
	return (
		<div className="flex justify-between md:justify-center px-2 py-2 items-center gap-x-3 md:gap-x-10">
			<button
				onClick={() => {
					setNavOpen(true)
				}}
				className="md:hidden"
			>
				<AiOutlineMenu className="w-8 h-8 text-black/70" />
			</button>
			<form className="flex-1 max-w-2xl">
				<input
					type="text"
					name=""
					id=""
					placeholder="Search..."
					className="focus:border-[#3a55a3] focus:outline-none  rounded-full py-1.5 px-4 w-full border font-inter text-sm border-[#c8c8c8]"
				/>
			</form>
			<div className="bg-[#3a54a31d] text-black/80 rounded-md p-1">
				<IoIosNotificationsOutline className="w-7 h-7 text-[#3a55a3]" />
			</div>
			<Modal
				onClose={() => {
					setNavOpen(false)
				}}
				open={navOpen}
			>
				<div className="h-full w-fit">
					<SideNav />
				</div>
			</Modal>
		</div>
	)
}

export default AppBar
