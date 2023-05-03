import { FormControl, MenuItem, Select } from "@mui/material"
import { v4 as uuidv4 } from "uuid"
import { Position } from "../sorting_algorithm/classes"
import StyledInput from "./StyledInput"

class InvigilatorSpot {
	constructor() {
		this.id = uuidv4()
		this.position = new Position(0, 0)
	}
}

const InvigilatorSpotTab = ({
	hall,
	setHall,
	activeInvigilatorSpotId,
	setActiveInvigilatorSpotId,
}) => {
	function handleChange(e) {
		setActiveInvigilatorSpotId(e.target.value)
	}

	function handleCreateInvigilatorSpotSubmit(e) {
		e.preventDefault()

		setHall((prev) => {
			prev.invigilatorSpots.push(new InvigilatorSpot())
			return { ...prev }
		})
	}

	const activeInvigilatorSpot = hall.invigilatorSpots.find(
		(iS) => iS.id === activeInvigilatorSpotId
	)

	function handleInvigilatorSpotPositionChange(e) {
		if (!e.target.value) return
		setHall((prev) => {
			activeInvigilatorSpot.position[e.target.id] = +e.target.value
			return { ...prev }
		})
	}

	function deleteInvigilatorSpot(e) {
		setHall((prev) => {
			prev.invigilatorSpots = prev.invigilatorSpots.filter(
				(iS) => iS.id !== activeInvigilatorSpotId
			)
			return { ...prev }
		})
		setActiveInvigilatorSpotId(null)
	}

	return (
		<div className="space-y-2">
			<FormControl fullWidth>
				<label htmlFor="active_invigilator_spot" className="font-semibold">
					Active Invigilator Spot
				</label>
				<Select
					id="active_invigilator_spot"
					style={{
						fontSize: "14px",
						fontFamily: "montserrat, san-serif",
						height: "35px",
					}}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
					value={activeInvigilatorSpotId ? activeInvigilatorSpotId : ""}
					onChange={handleChange}
				>
					<MenuItem
						style={{
							fontFamily: "montserrat, san-serif",
						}}
						value=""
					>
						None
					</MenuItem>
					{hall.invigilatorSpots.map((iS, idx) => {
						return (
							<MenuItem
								key={idx}
								style={{
									fontFamily: "montserrat, san-serif",
									fontSize: "14px",
								}}
								value={iS.id}
							>
								{iS.id}
							</MenuItem>
						)
					})}
				</Select>
			</FormControl>

			<form onSubmit={handleCreateInvigilatorSpotSubmit}>
				<span className="font-semibold">Create Invigilator Spot</span>
				<input
					className="ml-auto px-3 py-1 mt-1 w-full text-black/70 font-semibold cursor-pointer rounded-sm  bg-black/10 hover:bg-gray-400"
					type="submit"
					value="create new invigilator spot"
				/>
			</form>

			{activeInvigilatorSpotId ? (
				<div className="space-y-4">
					<form>
						<span className="font-semibold">Invigilator Spot Position</span>
						<div className="flex items-end gap-x-3">
							<div className="flex items-center gap-x-2">
								<label htmlFor="x">x:</label>
								<StyledInput
									name="x"
									id="x"
									min="-10000"
									max="10000"
									value={activeInvigilatorSpot.position.x}
									onChange={handleInvigilatorSpotPositionChange}
								/>
							</div>
							<div className="flex items-center gap-x-2">
								<label htmlFor="y">y:</label>
								<StyledInput
									name="y"
									id="y"
									min="-10000"
									max="10000"
									value={activeInvigilatorSpot.position.y}
									onChange={handleInvigilatorSpotPositionChange}
								/>
							</div>
						</div>
					</form>
					<button
						onClick={deleteInvigilatorSpot}
						className="border-gray-400 block w-full text-center py-1.5 text-[15px]  font-semibold text-white rounded-sm bg-red-500 hover:bg-red-700"
					>
						Delete Invigilator Spot
					</button>
				</div>
			) : (
				<div className="text-lg font-medium text-black/40 text-center py-36">
					Please select an invigilator spot to edit.
				</div>
			)}
		</div>
	)
}

export default InvigilatorSpotTab
