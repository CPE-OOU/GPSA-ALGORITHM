import { FormControl, Select, MenuItem } from "@mui/material"
import { useState, useEffect } from "react"
import { Section, PositionRelationships } from "../sorting_algorithm/classes"
import FormComponents from "./FormComponents"
import StyledInput from "./StyledInput"
import StyledWrapper from "./StyledWrapper"
import { toast } from "react-hot-toast"

const SectionTab = ({
	hall,
	activeSeatData,
	setActiveSeatData,
	activeSectionId,
	setActiveSectionId,
	secondaryActiveSectionId,
	setSecondaryActiveSectionId,
	setHall,
}) => {
	const activeSection = hall.sections.find((section) => section.id === activeSectionId)
	function handleChange(e) {
		setActiveSectionId(e.target.value)
	}
	function handleSecondaryActiveIdChange(e) {
		setSecondaryActiveSectionId(e.target.value)
	}
	const [newSectionData, setNewSectionData] = useState({ rows: 3, cols: 3, name: "" })

	const [newRelationshipData, setNewRelationshipData] = useState({
		sectionAlignment: "L-R",
	})
	const [rowOneStart, setRowOneStart] = useState(1)
	const [rowOneEnd, setRowOneEnd] = useState(1)
	const [rowTwoStart, setRowTwoStart] = useState(1)

	const [idStartNumber, setIdStartNumber] = useState(1)
	const [resizeData, setResizeData] = useState({
		resize_row: 0,
		resize_col: 0,
	})

	useEffect(() => {
		if (activeSection) {
			setResizeData({
				resize_row: activeSection.seats.length,
				resize_col: activeSection.seats[0].length,
			})
		}
	}, [activeSection])

	function handleSectionResize(e) {
		setResizeData((prev) => ({ ...prev, [e.target.id]: +e.target.value }))
	}

	function deleteSection() {
		if (activeSectionId && activeSeatData && activeSectionId === activeSeatData.sectionId) {
			setActiveSeatData(null)
		}
		if (activeSectionId) {
			setHall((prev) => {
				// TODO:clear all relationships
				prev.sections = prev.sections.filter((section) => section.id !== activeSectionId)
				return { ...prev }
			})
			setActiveSectionId(null)
		}
	}
	function handleResizeSubmit(e) {
		e.preventDefault()

		if (activeSectionId && activeSeatData && activeSectionId === activeSeatData.sectionId) {
			setActiveSeatData(null)
		}
		setHall((prev) => {
			// TODO:clear all relationships
			activeSection.seats = Section.generateSeats(...Object.values(resizeData), activeSection.id)
			return { ...prev }
		})
	}
	function handleCreateSectionSubmit(e) {
		e.preventDefault()
		for (const section of hall.sections) {
			if (section.name === newSectionData.name) {
				toast.error("A section already exists with the same name.")
				return
			}
		}
		const newSection = new Section(+newSectionData.rows, +newSectionData.cols, newSectionData.name)
		setHall((prev) => {
			prev.sections.push(newSection)
			return { ...prev }
		})
	}
	function handleNewSectionInputChange(e) {
		setNewSectionData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
	}

	function handleSectionPositionChange(e) {
		if (!e.target.value) return
		setHall((prev) => {
			if (e.target.id === "rotation") {
				activeSection.rotation = +e.target.value
			} else {
				activeSection.position[e.target.id] = +e.target.value
			}
			return { ...prev }
		})
	}

	function handleAssignSeatNumberSubmit(e) {
		e.preventDefault()
		setHall((prev) => {
			const flatenedSeats = activeSection.seats.flat()

			for (let i = 0; i < flatenedSeats.length; i++) {
				flatenedSeats[i].seatNumber = `${activeSection.name}-${i + idStartNumber}`
			}

			return { ...prev }
		})
	}

	function handleCreateSectionRelationshipSubmit(e) {
		e.preventDefault()

		if (!secondaryActiveSectionId || !activeSection) return
		const secondarySection = hall.sections.find(
			(section) => section.id === secondaryActiveSectionId
		)
		setHall((prev) => {
			Section.autoConstraint(activeSection, secondarySection, {
				rowOneEnd,
				rowOneStart,
				rowTwoStart,
			})
			return { ...prev }
		})
	}
	return (
		<div className="space-y-5 divide-y divide-black/30">
			<FormControl fullWidth>
				<label htmlFor="active_section" className="font-semibold">
					Active Section
				</label>
				<Select
					id="active_section"
					style={{
						fontSize: "14px",
						fontFamily: "montserrat, san-serif",
						height: "35px",
					}}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
					value={activeSectionId ? activeSectionId : ""}
					onChange={handleChange}
				>
					<MenuItem
						style={{
							fontFamily: "montserrat, san-serif",
						}}
						value=""
					>
						none
					</MenuItem>
					{hall.sections.map((section, idx) => {
						return (
							<MenuItem
								key={idx}
								style={{
									fontFamily: "montserrat, san-serif",
									fontSize: "14px",
								}}
								value={section.id}
							>
								section-{section.name}
							</MenuItem>
						)
					})}
				</Select>
			</FormControl>
			<form onSubmit={handleCreateSectionSubmit}>
				<span className="font-semibold">Create Section</span>
				<div className="space-y-2">
					<div className="flex justify-between">
						<div className="flex items-center gap-x-2">
							<label htmlFor="rows">rows:</label>
							<StyledInput
								min="1"
								name="rows"
								id="rows"
								value={newSectionData.rows}
								onChange={handleNewSectionInputChange}
							/>
						</div>
						<div className="flex items-center gap-x-2">
							<label htmlFor="cols">cols:</label>
							<StyledInput
								min="1"
								name="cols"
								id="cols"
								value={newSectionData.cols}
								onChange={handleNewSectionInputChange}
							/>
						</div>
						<div className="flex items-center gap-x-2">
							<label htmlFor="name">name:</label>
							<StyledInput
								name="name"
								required
								id="name"
								type="text"
								value={newSectionData.name}
								onChange={handleNewSectionInputChange}
							/>
						</div>
					</div>
					<input
						className="block w-full px-3 py-1 text-black/80 font-semibold cursor-pointer rounded-sm  bg-black/10 hover:bg-gray-400"
						type="submit"
						value="create"
					/>
				</div>
			</form>
			{activeSectionId ? (
				<div className="space-y-5 divide-y divide-black/30">
					<form>
						<span className="font-semibold">Section Position</span>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-x-2">
								<label htmlFor="x">x:</label>
								<StyledInput
									name="x"
									id="x"
									min="-10000"
									max="10000"
									value={activeSection.position.x}
									onChange={handleSectionPositionChange}
								/>
							</div>
							<div className="flex items-center gap-x-2">
								<label htmlFor="y">y:</label>
								<StyledInput
									name="y"
									id="y"
									min="-10000"
									max="10000"
									value={activeSection.position.y}
									onChange={handleSectionPositionChange}
								/>
							</div>
							<div className="flex items-center gap-x-2">
								<label htmlFor="rotation">rotation:</label>
								<StyledInput
									min="-360"
									max="360"
									name="rotation"
									id="rotation"
									value={activeSection.rotation}
									onChange={handleSectionPositionChange}
								/>
							</div>
						</div>
					</form>

					<form onSubmit={handleResizeSubmit}>
						<h2 className="font-semibold">Resize Section</h2>

						<div className="flex items-center gap-x-3">
							<div className="flex items-center gap-x-2">
								<label htmlFor="resize_row">rows:</label>
								<StyledInput
									min="1"
									name="rows"
									id="resize_row"
									value={resizeData.resize_row}
									onChange={handleSectionResize}
								/>
							</div>
							<div className="flex items-center gap-x-2">
								<label htmlFor="resize_col">cols:</label>
								<StyledInput
									min="3"
									name="resize_col"
									id="resize_col"
									value={resizeData.resize_col}
									onChange={handleSectionResize}
								/>
							</div>
							<input
								className="flex-1 px-3 py-1 text-black/80 font-semibold cursor-pointer rounded-sm  bg-black/10 hover:bg-gray-400"
								type="submit"
								value="resize"
							/>
						</div>
					</form>

					<form onSubmit={handleAssignSeatNumberSubmit}>
						<h2 className="font-semibold">Assign Seat Numbers</h2>

						<div className="flex items-center gap-x-3">
							<div>
								<label htmlFor="id_start_no">starting: </label>
								<StyledInput
									min="1"
									name="id_start_no"
									value={idStartNumber}
									onChange={(e) => e.target.value && setIdStartNumber(+e.target.value)}
									id="id_start_no"
								/>
							</div>
							<input
								className="flex-1 px-3 py-1 text-black/80 font-semibold cursor-pointer rounded-sm  bg-black/10 hover:bg-gray-400"
								type="submit"
								value="assign"
							/>
							<input
								className="flex-1 px-3 py-1 text-black/80 font-semibold cursor-pointer rounded-sm  bg-black/10 hover:bg-gray-400"
								type="button"
								value="clear"
								onClick={(e) => {
									setHall((prev) => {
										const flatenedSeats = activeSection.seats.flat()

										for (const seat of flatenedSeats) {
											seat.seatNumber = null
										}
										return { ...prev }
									})
								}}
							/>
						</div>
					</form>

					{/* <div>
						<h2 className="font-semibold">Section Relationships</h2>
						<div>
							<div className="flex flex-col gap-y-1">
								{activeSection.relatedSections.map((relatedSection, idx) => {
									return (
										<div
											key={idx}
											className="flex bg-gray-100 hover:bg-gray-300 px-2 py-1 gap-x-2 rounded-sm"
										>
											<span className="flex-1 min-w-0 truncate">{relatedSection}</span>
											<span className="font-bold cursor-pointer">X</span>
										</div>
									)
								})}
							</div>
							{activeSection.relatedSections.length === 0 && (
								<div className="text-center pt-2 font-medium text-black/40">
									No section relationships.
								</div>
							)}
						</div>
					</div> */}

					<div>
						<h2 className="font-semibold">Create Section Relationship</h2>
						<form className="space-y-3" onSubmit={handleCreateSectionRelationshipSubmit}>
							<div>
								<label htmlFor="secondary_active_section">Relate with</label>
								<Select
									className="w-full"
									id="secondary_active_section"
									style={{
										fontSize: "14px",
										fontFamily: "montserrat, san-serif",
										height: "35px",
									}}
									displayEmpty
									inputProps={{ "aria-label": "Without label" }}
									value={secondaryActiveSectionId ? secondaryActiveSectionId : ""}
									onChange={handleSecondaryActiveIdChange}
								>
									<MenuItem
										style={{
											fontFamily: "montserrat, san-serif",
										}}
										value=""
									>
										none
									</MenuItem>
									{hall.sections
										.filter((section) => section.id !== activeSectionId)
										.map((section, idx) => {
											return (
												<MenuItem
													key={idx}
													style={{
														fontSize: "14px",
														fontFamily: "montserrat, san-serif",
													}}
													value={section.id}
												>
													section-{section.name}
												</MenuItem>
											)
										})}
								</Select>
							</div>
							<div>
								<label htmlFor="section-allignment">Section Alignment</label>
								<FormComponents.SingleOptionInput
									value={newRelationshipData.sectionAlignment}
									onChange={(v) => {
										setNewRelationshipData((prev) => {
											prev.sectionAlignment = v
											return { ...prev }
										})
									}}
									wrapper={StyledWrapper}
								>
									{PositionRelationships.map((pr, idx) => {
										return (
											<FormComponents.Option
												style={{
													padding: "1px 14px",
												}}
												key={idx}
												value={pr}
											>
												<span className="text-[12px]">{pr}</span>
											</FormComponents.Option>
										)
									})}
								</FormComponents.SingleOptionInput>
							</div>
							<div className="flex items-end gap-2 justify-between">
								<div className="flex flex-col">
									<span>1st start</span>
									<StyledInput
										value={rowOneStart}
										min="1"
										onChange={(e) => e.target.value && setRowOneStart(+e.target.value)}
									/>
								</div>
								<div className="flex flex-col">
									<span>1st end</span>
									<StyledInput
										min="1"
										value={rowOneEnd}
										onChange={(e) => e.target.value && setRowOneEnd(+e.target.value)}
									/>
								</div>
								<div className="flex flex-col">
									<span>2nd start</span>
									<StyledInput
										value={rowTwoStart}
										onChange={(e) => e.target.value && setRowTwoStart(+e.target.value)}
									/>
								</div>
								<input
									className="flex-1 px-3 py-1 text-black/80 font-semibold cursor-pointer rounded-sm  bg-black/10 hover:bg-gray-400"
									type="submit"
									value="create"
								/>
							</div>
						</form>
					</div>
					<button
						onClick={deleteSection}
						className="border-gray-400 block w-full text-center py-1.5 text-[15px]  font-semibold text-white rounded-sm bg-red-500 hover:bg-red-700"
					>
						Delete Section
					</button>
				</div>
			) : (
				<div className="text-lg font-medium text-black/40 text-center py-36">
					Please select a section to edit.
				</div>
			)}
		</div>
	)
}

export default SectionTab
