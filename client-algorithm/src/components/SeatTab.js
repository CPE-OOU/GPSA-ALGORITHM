import FormComponents from "./FormComponents"
import { useSelectMode } from "../hooks/useSelectMode"

const SeatTab = ({ activeSeatData, hall, setHall }) => {
	let currentSeat = null
	let currentSection = null
	if (activeSeatData) {
		currentSection = hall.sections.find((section) => section.id === activeSeatData.sectionId)
		currentSeat = currentSection?.seats[activeSeatData.row][activeSeatData.col]
	}

	const selectMode = useSelectMode()
	return (
		<div>
			{!currentSeat ? (
				<p className="py-40 text-lg font-medium text-center text-black/50">
					Please select a seat to edit.
				</p>
			) : (
				<div className="flex flex-col -mt-4 [&>*]:py-2 divide-y divide-black/30">
					<div className="flex gap-2">
						<span>Section Name:</span>
						<span className="flex-1 truncate min-w-0">section-{currentSection.name}</span>
					</div>
					<div className="flex gap-2">
						<span>Section ID:</span>
						<span className="flex-1 truncate min-w-0">{currentSeat.sectionId}</span>
					</div>
					<div className="flex gap-2">
						<span>Position: </span>
						<div>
							<span>row: </span>
							{currentSeat.position.row + 1}
							<span> col: </span>
							{currentSeat.position.col + 1}
						</div>
					</div>

					<div className="flex gap-2">
						<span>Seat Number:</span>
						<span>{currentSeat.seatNumber ?? "Not set"}</span>
					</div>
					<div className="flex gap-2 items-center">
						<span>Seat Condition:</span>
						<FormComponents.SingleOptionInput
							wrapper={({ children }) => {
								return <div className="flex gap-x-2">{children}</div>
							}}
							value={currentSeat.inGoodCondition ? "good" : "bad"}
							onChange={(value) => {
								setHall((prev) => {
									currentSeat.inGoodCondition = value === "good" ? true : false
									currentSection.seats = [...currentSection.seats]
									return { ...prev }
								})
							}}
						>
							<FormComponents.Option
								key={"good"}
								style={{
									paddingTop: "0px",
									paddingBottom: "0px",
								}}
								value={"good"}
							>
								Good
							</FormComponents.Option>
							<FormComponents.Option
								key={"bad"}
								style={{
									paddingTop: "0px",
									paddingBottom: "0px",
								}}
								value={"bad"}
							>
								Bad
							</FormComponents.Option>
						</FormComponents.SingleOptionInput>
					</div>

					<div>
						<span>Foreign Constraints:</span>
						<ul className="pl-3">
							{Object.entries(currentSeat.constraints).map(([level, constraints], idx) => (
								<li key={idx}>
									<span className="font-semibold text-black/70">Level {level}:</span>
									{constraints.map((constraint, idx) => {
										return (
											<ul className="pl-3" key={idx}>
												<li className="flex gap-x-4">
													<span title={constraint.sectionId} className="min-w-0 truncate flex-1">
														section name:{" "}
														{hall.sections.find((s) => s.id === constraint.sectionId).name}
													</span>
													<span>row: {constraint.row + 1}</span>
													<span>col: {constraint.col + 1}</span>
													{/* <span>X</span> */}
												</li>
											</ul>
										)
									})}
									{constraints.length === 0 && (
										<div className="text-center text-black/50 pb-1">No Constraints.</div>
									)}
									<button
										onClick={() => {
											selectMode.setActive(true)
											selectMode.setLevel(level)
											selectMode.setSource(currentSeat, constraints, hall)
										}}
										className="w-full bg-black/10 font-semibold text-black/80 hover:bg-gray-400 py-1 rounded-sm"
									>
										Add level {level} constraint
									</button>
								</li>
							))}

							{selectMode.active && (
								<button
									onClick={() => selectMode.recordConstraints(setHall)}
									className="w-full p-2 bg-green-500 hover:bg-green-300 my-2 rounded-md font-semibold"
								>
									Save
								</button>
							)}
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

export default SeatTab
