import { createContext, useState } from "react"
import { Constraint } from "../sorting_algorithm/classes"

export const SelectModeContext = createContext({})

export function SelectModeContextProvider({ children }) {
	const [active, setActive] = useState(false)
	const [selectedSeats, setSelectedSeats] = useState([])
	const [level, setLevel] = useState(null)

	const [source, setSource] = useState(null)

	function addSeat(seat) {
		if (seat.sectionId === source.sectionId) return
		if (selectedSeats.find((s) => s === seat)) return
		if (
			Object.values(source.constraints)
				.flat()
				.find((constraint) => {
					return (
						constraint.sectionId === seat.sectionId &&
						constraint.col === seat.position.col &&
						constraint.row === seat.position.row
					)
				})
		)
			return
		setSelectedSeats([...selectedSeats, seat])
	}

	function setSource_(source, constraints, hall) {
		setSource(source)
		setSelectedSeats(
			constraints.map((constraint) => {
				const seat = hall.sections.find((section) => section.id === constraint.sectionId).seats[
					constraint.row
				][constraint.col]
				return seat
			})
		)
	}
	function recordConstraints(setHall) {
		selectedSeats.forEach((seat) => {
			if (
				seat.constraints[level].find((constraint) => {
					return (
						constraint.sectionId === source.sectionId &&
						constraint.row === source.position.row &&
						constraint.col === source.position.col
					)
				})
			)
				return
			seat.constraints[level].push(
				new Constraint(source.sectionId, source.position.row, source.position.col)
			)
			source.constraints[level].push(
				new Constraint(seat.sectionId, seat.position.row, seat.position.col)
			)
		})
		setHall((prev) => ({ ...prev }))
		setActive(false)
		setSelectedSeats([])
		setLevel(null)
		setSource(null)
	}

	return (
		<SelectModeContext.Provider
			value={{
				active,
				setLevel,
				level,
				setActive,
				setSource: setSource_,
				recordConstraints,
				addSeat,
				selectedSeats,
			}}
		>
			{children}
		</SelectModeContext.Provider>
	)
}
