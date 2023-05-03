import { useMemo } from "react"
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone"
import { useSelectMode } from "../hooks/useSelectMode"

const RenderSection = ({
	section,
	activeSeatData,
	setActiveSeatData,
	setActiveContextMenu,
	activeSectionId,
	setActiveSectionId,
	secondaryActiveSectionId,
	onClick,
	colors,
}) => {
	let selectMode = null

	try {
		const s = useSelectMode()
		selectMode = s
	} catch (error) {}

	return (
		<div
			title={"section-" + section.name}
			className="flex flex-col gap-1 relative"
			onClick={(e) => {
				if (selectMode && selectMode.active) return
				e.stopPropagation()
				if (activeSectionId !== section.id) {
					setActiveSectionId && setActiveSectionId(section.id)
				}
			}}
			style={{
				boxShadow:
					selectMode && selectMode.active
						? ""
						: activeSectionId === section.id
						? "0 0 0 4px white, 0 0 0 6px #3788de"
						: secondaryActiveSectionId === section.id
						? "0 0 0 4px white, 0 0 0 6px rgba(0, 0, 0, 0.3)"
						: "",
			}}
		>
			{activeSectionId === section.id && (
				<span className="absolute -top-[23px] -left-[5px] text-blue-500 text-sm">
					section-{section.name}
				</span>
			)}
			{useMemo(
				() => {
					return section.seats.map((row, idx) => {
						return (
							<div key={idx} className="flex gap-1">
								{row.map((seat, idx) => {
									return (
										<span
											key={idx}
											onClick={() => {
												if (selectMode && selectMode.active) {
													selectMode.addSeat(seat)
													return
												}
												onClick && onClick(seat)
												setActiveSeatData &&
													setActiveSeatData({
														sectionId: seat.sectionId,
														row: seat.position.row,
														col: seat.position.col,
													})
											}}
											onContextMenu={(e) => {
												e.preventDefault()
												if (selectMode && selectMode.active) return
												setActiveContextMenu &&
													setActiveContextMenu({
														position: { x: e.clientX, y: e.clientY },
														type: "seat",
														seat,
													})
											}}
											className={`w-9 h-4 rounded-sm  relative  flex ${
												activeSeatData &&
												activeSeatData.sectionId === seat.sectionId &&
												activeSeatData.row === seat.position.row &&
												activeSeatData.col === seat.position.col
													? "bg-[#3788de]"
													: "bg-[#88b8eb]"
											}    hover:bg-[#3788de] cursor-pointer`}
										>
											{selectMode &&
											selectMode.active &&
											selectMode.selectedSeats.includes(seat) ? (
												<div className="grid place-items-center w-full h-full absolute top-0 left-0">
													<span className="h-full aspect-square rounded-full bg-red-900"></span>
												</div>
											) : selectMode && selectMode.active ? (
												<></>
											) : !seat.inGoodCondition ? (
												<div className="grid place-items-center w-full h-full absolute top-0 left-0">
													<CloseTwoToneIcon className="!w-full !h-full text-red-600"></CloseTwoToneIcon>
												</div>
											) : (
												<></>
											)}

											{seat.courses &&
												seat.courses.map((course, idx) => (
													<div
														key={idx}
														style={{
															backgroundColor: colors[course],
														}}
														className={`flex-1 h-full`}
													></div>
												))}
										</span>
									)
								})}
							</div>
						)
					})
				}
				// ,[activeSeatData, section.seats]
			)}
		</div>
	)
}

export default RenderSection
