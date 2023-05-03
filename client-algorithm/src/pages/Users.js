import { Modal } from "@mui/material"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Loader from "../components/Loader"
import TableDisplay from "../components/TableDisplay"
import axiosInstance from "../utils/axios"

const Users = () => {
	const [users, setUsers] = useState([])

	const [firstname, setFirstname] = useState("")
	const [lastname, setLastname] = useState("")
	const [email, setEmail] = useState("")
	const [loading, setLoading] = useState(false)
	const [newUserModalOpen, setNewUserModalOpen] = useState(false)
	async function fetchUsers() {
		setLoading(true)
		try {
			const users = (await axiosInstance.get("/api/v1/users")).data.users
			setUsers(users)
		} catch (error) {
			toast.error("Failed to load users.")
		} finally {
			setLoading(false)
		}
	}

	async function deleteUser(id) {
		setLoading(true)
		try {
			const res = await axiosInstance.delete(`/api/v1/users/${id}`)
			setUsers((prev) => prev.filter((user) => user.id !== id))
			toast.success("User Deleted.")
		} catch (error) {
			toast.success("Failed to delete user.")
		} finally {
			setLoading(false)
		}
	}

	async function createAdmin(first_name, last_name, email) {
		setLoading(true)
		try {
			const res = await axiosInstance.post("/api/v1/admin", {
				first_name,
				last_name,
				email,
			})
			console.log(res)
			await fetchUsers()
			toast.success("Successful, check your mail for the login details.")
			setNewUserModalOpen(false)
		} catch (err) {
			toast.error("Failed to create user.")
		} finally {
			setLoading(false)
		}
	}

	async function deactivateAdmin(id) {
		const res = await axiosInstance.post("/api/v1/admin/deactivate", {
			id,
		})
	}

	async function activateAdmin(id) {
		const res = await axiosInstance.post("/api/v1/admin/activate", {
			id,
		})
	}

	function handleFormSubmit(e) {
		e.preventDefault()
		createAdmin(firstname, lastname, email)
	}

	useEffect(() => {
		fetchUsers()
	}, [])
	return (
		<div className="w-full pt-2 pb-20">
			<h2 className="section-title">Users</h2>
			<TableDisplay
				labels={["Firstname", "Lastname", "Role", "Email", "Status"]}
				rows={users}
				formatRow={(row) => {
					let ret = []

					ret.push(row.first_name)
					ret.push(row.last_name)
					ret.push(row.role)
					ret.push(row.email)
					ret.push(row.status)
					return ret
				}}
				addNew="+ Add new user"
				onRowClick={(row) => {
					console.log(row)
				}}
				onNew={() => {
					setNewUserModalOpen(true)
				}}
				onDelete={(row) => {
					deleteUser(row.id)
				}}
			/>

			<Loader open={loading} />
			<Modal
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				onClose={() => {
					console.log("closing")
					setNewUserModalOpen(false)
				}}
				open={newUserModalOpen}
			>
				<div className="w-full px-5 max-w-md font-inter">
					<div className="bg-white rounded-lg p-6">
						<h2 className="section-title pl-0">Add new user</h2>
						<form className="w-full max-w-lg" onSubmit={handleFormSubmit}>
							<div className="space-y-4">
								<div className="form-option ">
									<label htmlFor="firstname" className="field-title">
										Firstname
									</label>
									<input
										value={firstname}
										onChange={(e) => {
											setFirstname(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="text"
										name="firstname"
										id="firstname"
									/>
								</div>
								<div className="form-option ">
									<label htmlFor="lastname" className="field-title">
										Lastname
									</label>
									<input
										value={lastname}
										onChange={(e) => {
											setLastname(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="text"
										name="lastname"
										id="lastname"
									/>
								</div>
								<div className="form-option ">
									<label htmlFor="email" className="field-title">
										Email
									</label>
									<input
										value={email}
										onChange={(e) => {
											setEmail(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="email"
										name="email"
										id="email"
									/>
								</div>
							</div>
							<input
								disabled={!firstname || !lastname || !email}
								type="submit"
								className="bg-primarydark cursor-pointer rounded-md disabled:cursor-not-allowed text-white text-sm font-semibold w-[75%] py-3 mt-8 mx-auto block"
								value="Create User"
							/>
						</form>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default Users
