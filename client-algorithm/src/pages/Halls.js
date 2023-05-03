import React from "react"
import axios from "../utils/axios"
import RenderSeats from "../components/RenderSeat"
import Hall from "../sorting_algorithm/Hall"
import toast from "react-hot-toast"
import Loader from "../components/Loader"
import Table from "../components/Table"
import { Link, useNavigate } from "react-router-dom"
import TableDisplay from "../components/TableDisplay"

const Halls = () => {
	const [loading, setLoading] = React.useState(false)

	const [halls, setHalls] = React.useState([])

	const navigate = useNavigate()

	React.useEffect(async () => {
		try {
			setLoading(true)
			let response = await axios.get("/api/v1/halls")

			setHalls(response.data.halls)
		} catch (error) {
			toast.error("Failed to load halls")
		} finally {
			setLoading(false)
		}
	}, [])

	async function deleteHall(hall) {
		try {
			setLoading(true)
			let response = await axios.delete(`/api/v1/halls/${hall.id}`)
			setHalls((prev) => {
				return prev.filter((h) => h.id !== hall.id)
			})
		} catch (error) {
			toast.error("Failed to delete hall")
		} finally {
			setLoading(false)
		}
	}
	return (
		<div>
			<h2 className="section-title">Avaialble Halls</h2>
			<TableDisplay
				labels={["Name", "Capacity", "Department"]}
				rows={halls}
				onRowClick={(row) => {
					navigate(`/model_hall/${row.id}`)
				}}
				formatRow={(row) => {
					let ret = []
					ret.push(row.name)
					ret.push(row.capacity)
					ret.push(row.department)
					return ret
				}}
				onDelete={(row) => {
					deleteHall(row)
				}}
				onNew={() => {
					navigate("/model_hall")
				}}
				addNew={"+ Add new hall"}
			/>
			<Loader open={loading} />
		</div>
	)
}

export default Halls
