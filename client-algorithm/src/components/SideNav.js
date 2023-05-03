import React from "react"
import { BiTachometer } from "react-icons/bi"
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload"
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined"
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined"
import { NavLink } from "react-router-dom"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import useAuth from "../hooks/useAuth"

const SideNav = () => {
	const { user, logout } = useAuth()
	return (
		<div className="md:border-r shadow h-full">
			<div className="w-[17rem] flex flex-col overflow-y-auto bg-white p-3 h-full">
				{/* Avatar */}

				{/* SideNav */}
				<ul className="overflow-y-auto bg-white font-poppins mt-12">
					<div className="">
						<small className="font-bold px-3 text-gray-600">MENU</small>

						<NavLink
							to="app"
							style={({ isActive }) => {
								return {
									color: isActive ? "white" : "#898989",
									background: isActive ? "#3a55a3" : "",
									fontWeight: isActive ? "600" : "500",
								}
							}}
							className=" p-3 rounded-lg flex items-center space-x-4 mt-1"
						>
							<BiTachometer className="w-6 h-6" />
							<p className="text-sm">Dashboard</p>
						</NavLink>
						<NavLink
							to="courses"
							style={({ isActive }) => {
								return {
									color: isActive ? "white" : "#898989",
									background: isActive ? "#3a55a3" : "",
									fontWeight: isActive ? "600" : "500",
								}
							}}
							className=" p-3 rounded-lg flex items-center space-x-4 mt-1"
						>
							<DriveFolderUploadIcon className="!w-6 !h-6" />
							<p className="text-sm">Courses</p>
						</NavLink>
						<NavLink
							to="halls"
							style={({ isActive }) => {
								return {
									color: isActive ? "white" : "#898989",
									background: isActive ? "#3a55a3" : "",
									fontWeight: isActive ? "600" : "500",
								}
							}}
							className=" p-3 rounded-lg flex items-center space-x-4 mt-1"
						>
							<EventSeatOutlinedIcon className="!w-6 !h-6" />
							<p className="text-sm">Halls</p>
						</NavLink>

						<NavLink
							to="users"
							style={({ isActive }) => {
								return {
									color: isActive ? "white" : "#898989",
									background: isActive ? "#3a55a3" : "",
									fontWeight: isActive ? "600" : "500",
								}
							}}
							className=" p-3 rounded-lg flex items-center space-x-4 mt-1"
						>
							<SupervisorAccountOutlinedIcon className="!w-6 !h-6" />
							<p className="text-sm">Users</p>
						</NavLink>
						<hr className="h-0.5 my-8 bg-[#898989]"></hr>
						<div
							onClick={() => {
								logout()
							}}
							className="text-[#898989] p-3 rounded-lg flex items-center space-x-4  hover:bg-[#3a55a3] hover:text-white cursor-pointer"
						>
							<ExitToAppIcon className="!w-6 !h-6" />
							<p className="text-sm">Logout</p>
						</div>
					</div>
				</ul>

				<div className="p-3 px-4 flex-1 flex items-end space-x-6 ">
					<div className="inline-flex overflow-hidden relative justify-center items-center w-10 h-10 bg-blue-600 rounded-full dark:bg-gray-600">
						<span className="font-medium text-white dark:text-gray-300">
							{user.first_name.charAt(0).toUpperCase()}
							{user.last_name.charAt(0).toUpperCase()}
						</span>
					</div>
					<div className="font-poppins flex-col flex">
						<h6 className="font-bold text-md">
							{" "}
							{user.first_name} {user.last_name}{" "}
						</h6>
						<small className="text-gray-700 font-medium">{user.role.toUpperCase()}</small>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SideNav
