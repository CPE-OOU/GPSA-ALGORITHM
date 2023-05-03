import Paper from "@mui/material/Paper"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import Slider from "@mui/material/Slider"
import { useState, useEffect, useRef } from "react"
import PersonIcon from "@mui/icons-material/Person"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import OOULogo from "./oou.png"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import axios from "../utils/axios"
import ResizeWrapper from "../components/ResizeWrapper"
import MovableWrapper from "../components/MovableWrapper"
import RenderSection from "../components/RenderSection"
import SeatTab from "../components/SeatTab"
import SectionTab from "../components/SectionTab"
import InvigilatorSpotTab from "../components/InvigilatorSpotsTab"
import { Position, Hall } from "../sorting_algorithm/classes"
import SeatContextMenu from "../components/SeatContextMenu"
import axios2 from "axios"
import Loader from "../components/Loader"
import toast from "react-hot-toast"
import { verifySeatNumbersConstraints } from "../sorting_algorithm/generateArrangements"
import { useSelectMode } from "../hooks/useSelectMode"

function TabPanel({ children, value, index, ...other }) {
	return (
		<div
			className="text-sm py-3 px-2"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <div style={{ padding: "3px" }}>{children}</div>}
		</div>
	)
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	}
}

const HallPage = () => {
	const [zoomSize, setZoomSize] = useState(1)

	const [loading, setLoading] = useState(false)

	const selectMode = useSelectMode()

	const { hall_id } = useParams()
	const [tempHall, setHall] = useState(() => {
		const hall = new Hall()
		if (hall_id) {
			hall.id = hall_id
		}
		return hall
	})

	const location = useLocation()
	useEffect(async () => {
		if (hall_id && location.state?.hallModel) {
			setHall(location.state.hallModel)
		} else if (hall_id) {
			try {
				setLoading(true)
				const hall = await axios.get(`api/v1/halls/${hall_id}`)
				const hallModel = await axios2.get(hall.data.file.url)
				setHall(hallModel.data)
			} catch (e) {
				toast.error("error loading hall model")
				navigate("/model_hall", { replace: true })
			} finally {
				setLoading(false)
			}
		} else {
			setHall(new Hall())
		}
	}, [hall_id])
	/* For MovableWrapper */
	const [movableState, setMovableState] = useState(null)
	const [resizeEntry, setResizeEntry] = useState(null)
	const [activeContextMenu, setActiveContextMenu] = useState(null)

	const [value, setValue] = useState(0)

	// For Sections Tab
	// Active Section
	const [activeSectionId, setActiveSectionId] = useState(null)

	// Secondary Active Section
	const [secondaryActiveSectionId, setSecondaryActiveSectionId] = useState(null)

	// For Seats Tab
	const [activeSeatData, setActiveSeatData] = useState(null)

	// Invigilator Spot Tabs
	const [activeInvigilatorSpotId, setActiveInvigilatorSpotId] = useState(null)

	const downloadLinkRef = useRef(null)

	const navigate = useNavigate()

	useEffect(() => {
		setSecondaryActiveSectionId(null)
	}, [activeSectionId])

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	useEffect(() => {
		setActiveSectionId(null)
		setActiveSeatData(null)
	}, [location.pathname])
	async function saveHall(e) {
		let action = "post"
		let url = "/api/v1/halls"
		if (hall_id) {
			action = "put"
			url = `/api/v1/halls/${hall_id}`
		}

		// verify hall
		try {
			verifySeatNumbersConstraints(tempHall)
			if (!tempHall.invigilatorSpots.length) {
				throw new Error("halls must have at least one invigilator spot")
			}
		} catch (error) {
			toast.error(error.message)
		}

		const hallFormData = new FormData()
		const hallCapacity = tempHall.sections
			.map((section) => {
				let a = section.seats.flat()
				return a
			})
			.flat()
			.filter((seat) => seat.inGoodCondition).length
		hallFormData.append("name", tempHall.name)
		hallFormData.append("capacity", hallCapacity)
		hallFormData.append("department", tempHall.department ?? "Not Set")
		hallFormData.append("hall_file", new Blob([JSON.stringify(tempHall)]))

		let response
		try {
			setLoading(true)
			response = await axios[action](url, hallFormData)
			toast.success("sucessfully saved hall model")
		} catch (e) {
			toast.error("error saving hall model")
		} finally {
			setLoading(false)
		}
		if (!hall_id) {
			navigate(`/model_hall/${response.data.id}`, { replace: true, state: { hallModel: tempHall } })
		}
	}
	return (
		<div className="select-none w-full h-screen overflow-y-hidden flex  flex-col">
			<Loader open={loading} />
			{/* TopBar */}
			<div className="border-b-[1px] border-gray-400 flex gap-x-2 pl-2">
				{/* <div className="self-center w-12 h-12">
					<Link to="/dashboard/halls">
						<img
							className="w-full h-full object-contain"
							src={OOULogo}
							alt="Olabisi Onabanjo University Logo"
						/>
					</Link>
				</div> */}
				<div className="divide-y divide-gray-400 pt-1 [&>*]:pr-4 flex-1">
					<div>
						<h1 className="font-semibold text-lg text-black/80">Hall Modelling Tool</h1>
					</div>
					<nav>
						<ul className="flex text-[13px] gap-x-4 [&>*]:pt-1 [&>*]:cursor-pointer">
							<li
								onClick={() => {
									navigate("/model_hall")
								}}
								className="pr-1 hover:bg-gray-300"
							>
								New
							</li>
							<li className="px-1 hover:bg-gray-300">Halls</li>
							<li onClick={saveHall} className="px-1 hover:bg-gray-300">
								Save
							</li>
							<li
								className="px-1 hover:bg-gray-300"
								onClick={async () => {
									if (hall_id) {
										try {
											setLoading(true)
											await axios.delete(`api/v1/halls/${hall_id}`)
											toast.success("successfully deleted hall")
											navigate("/model_hall", { replace: true })
										} catch (e) {
											toast.error("error deleting hall")
										} finally {
											setLoading(false)
										}
									}
								}}
							>
								Delete
							</li>
						</ul>
					</nav>
				</div>
			</div>
			{/* WorkArea */}

			<div className="flex flex-1 overflow-hidden">
				<div
					onMouseMove={(e) => {
						if (resizeEntry) {
							let change =
								resizeEntry[resizeEntry.position] -
								(resizeEntry.position === "x" ? e.clientX : e.clientY)

							if (!resizeEntry.updateSection) {
								change *= -1
							}
							setHall((prev) => {
								prev.size[resizeEntry.position === "x" ? "width" : "height"] += change / zoomSize

								if (resizeEntry.updateSection) {
									for (const section of prev.sections) {
										section.position[resizeEntry.position] += change / zoomSize
									}

									for (const invigilatorSpot of prev.invigilatorSpots) {
										invigilatorSpot.position[resizeEntry.position] += change / zoomSize
									}
									prev.paper[resizeEntry.position] -= change
								}
								return { ...prev }
							})
							setResizeEntry((prev) => {
								prev.x = e.clientX
								prev.y = e.clientY
								return { ...prev }
							})
						}
					}}
					onMouseUp={(e) => {
						if (resizeEntry) {
							setHall((prev) => {
								prev.paper = { x: 0, y: 0 }
								return prev
							})
							setResizeEntry(null)
						}
					}}
					onMouseLeave={(e) => {
						if (resizeEntry) {
							setHall((prev) => {
								prev.paper = { x: 0, y: 0 }
								return prev
							})
							setResizeEntry(null)
						}
					}}
					className="flex-1 overflow-scroll scrollbar bg-gray-200"
				>
					<div
						style={{
							transform: `scale(${zoomSize})`,
							transformOrigin: zoomSize < 1 ? "50% 50% 0" : "0 0",
							top: `${tempHall.paper.y.toFixed(0)}px`,
							left: `${tempHall.paper.x.toFixed(0)}px`,
						}}
						className="w-auto [&>*]:p-28 h-full grid place-items-center relative"
					>
						<div>
							<ResizeWrapper setResizeEntry={setResizeEntry}>
								<div
									onMouseMove={(e) => {
										if (movableState) {
											const changeX = e.clientX - movableState.position.x
											const changeY = e.clientY - movableState.position.y

											setMovableState((prev) => {
												return { ...prev, position: new Position(e.clientX, e.clientY) }
											})
											setHall((prev) => {
												let itemPositionToUpdate = prev[movableState.type].find(
													(movableItem) => movableItem.id === movableState.id
												)
												if (itemPositionToUpdate) {
													itemPositionToUpdate.position = new Position(
														itemPositionToUpdate.position.x + +(changeX / zoomSize).toFixed(0),
														itemPositionToUpdate.position.y + +(changeY / zoomSize).toFixed(0)
													)
												}
												return { ...prev }
											})
										}
									}}
									onTouchMove={(e) => {
										e.clientX = e.touches[0].clientX
										e.clientY = e.touches[0].clientY
										if (movableState) {
											const changeX = e.clientX - movableState.position.x
											const changeY = e.clientY - movableState.position.y

											setMovableState((prev) => {
												return { ...prev, position: new Position(e.clientX, e.clientY) }
											})
											setHall((prev) => {
												let itemPositionToUpdate = prev[movableState.type].find(
													(movableItem) => movableItem.id === movableState.id
												)
												if (itemPositionToUpdate) {
													itemPositionToUpdate.position = new Position(
														itemPositionToUpdate.position.x + +(changeX / zoomSize).toFixed(0),
														itemPositionToUpdate.position.y + +(changeY / zoomSize).toFixed(0)
													)
												}
												return { ...prev }
											})
										}
									}}
									{...["onMouseUp", "onTouchEnd", "onMouseLeave"].reduce((a, c) => {
										a[c] = (e) => {
											if (movableState) {
												setMovableState(null)
											}
										}
										return a
									}, {})}
								>
									<Paper
										onClick={() => {
											if (selectMode && selectMode.active) return
											setActiveSectionId(null)
											setActiveSeatData(null)
											setActiveInvigilatorSpotId(null)
										}}
										elevation={4}
										square
										style={{
											width: `${tempHall.size.width}px`,
											height: `${tempHall.size.height}px`,
										}}
										className="overflow-hidden relative border-[1px] border-gray-400"
									>
										{/* overlay */}
										{selectMode.active && (
											<div className="absolute top-0 left-0 w-full h-full bg-black/50 cursor-crosshair"></div>
										)}
										{/* overlay end */}

										{tempHall.sections.map((section, idx) => (
											<MovableWrapper
												key={idx}
												position={section.position}
												rotation={section.rotation}
												onMouseDown={(e) => {
													setMovableState({
														type: "sections",
														position: new Position(e.clientX, e.clientY),
														id: section.id,
													})
												}}
											>
												<RenderSection
													activeSeatData={activeSeatData}
													setActiveSeatData={setActiveSeatData}
													activeSectionId={activeSectionId}
													setActiveSectionId={setActiveSectionId}
													secondaryActiveSectionId={secondaryActiveSectionId}
													section={section}
													setActiveContextMenu={setActiveContextMenu}
												/>
											</MovableWrapper>
										))}
										{tempHall.invigilatorSpots.map((invigilatorSpot, idx) => (
											<MovableWrapper
												key={idx}
												position={invigilatorSpot.position}
												rotation={0}
												onMouseDown={(e) => {
													setMovableState({
														type: "invigilatorSpots",
														position: new Position(e.clientX, e.clientY),
														id: invigilatorSpot.id,
													})
												}}
											>
												<div
													style={{
														boxShadow:
															activeInvigilatorSpotId === invigilatorSpot.id
																? "0 0 0 4px white, 0 0 0 6px #3788de"
																: "",
													}}
													onClick={(e) => {
														e.stopPropagation()
														setActiveInvigilatorSpotId(invigilatorSpot.id)
													}}
													className="w-4 h-4  hover:bg-red-900 bg-red-700"
												></div>
											</MovableWrapper>
										))}
									</Paper>
								</div>
							</ResizeWrapper>
						</div>
					</div>
				</div>

				<aside className="grow-0 shrink-0 relative max-h-full">
					<input
						type="checkbox"
						className="cursor-pointer peer absolute z-10 top-0 -left-8 w-8 h-5 opacity-0"
					/>
					<span className="peer-checked:[&>*]:rotate-180 peer-checked:bg-gray-200 absolute rounded-tl-full grid place-items-center rounded-bl-full h-5 w-8 -top-[1px] -left-8  border bg-white border-gray-400">
						<ArrowBackIcon
							style={{
								fontSize: "16px",
							}}
						/>
					</span>
					<div className="max-w-0 peer-checked:max-w-[1000px] h-full transition-[max-width] duration-300">
						<div className="w-[340px] flex flex-col h-full">
							<div className="border-b border-gray-400">
								<Tabs value={value} onChange={handleChange}>
									{["Sections", "Seats", "Invigilator Spots"].map((tab, idx) => (
										<Tab
											key={idx}
											style={{
												fontFamily: "montserrat, sans-serif",
												textTransform: "capitalize",
											}}
											label={tab}
											{...a11yProps(idx)}
										/>
									))}
								</Tabs>
							</div>
							<div className="flex-1  overflow-hidden">
								<div className="overflow-y-auto h-full scrollbar">
									<TabPanel value={value} index={0}>
										<SectionTab
											activeSeatData={activeSeatData}
											setActiveSeatData={setActiveSeatData}
											activeSectionId={activeSectionId}
											setActiveSectionId={setActiveSectionId}
											secondaryActiveSectionId={secondaryActiveSectionId}
											setSecondaryActiveSectionId={setSecondaryActiveSectionId}
											hall={tempHall}
											setHall={setHall}
										/>
									</TabPanel>
									<TabPanel value={value} index={1}>
										<SeatTab activeSeatData={activeSeatData} hall={tempHall} setHall={setHall} />
									</TabPanel>

									<TabPanel value={value} index={2}>
										<InvigilatorSpotTab
											hall={tempHall}
											setHall={setHall}
											activeInvigilatorSpotId={activeInvigilatorSpotId}
											setActiveInvigilatorSpotId={setActiveInvigilatorSpotId}
										/>
									</TabPanel>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>

			{/* BottomBar */}
			<div className="[&>*]:py-1 border-t-[1px] divide-x-[1px] divide-gray-400  border-gray-400 flex gap-x-2 px-4 text-sm">
				<span className="w-[clamp(150px,10vw,400px)] font-bold">
					<input
						onChange={(e) => {
							if (e.target.value) {
								setHall((prev) => {
									prev.name = e.target.value
									return { ...prev }
								})
							}
						}}
						className="w-full h-full outline-none border-transparent focus:ring-0 focus:border-transparent focus:outline-none"
						type="text"
						name="hall-name"
						value={tempHall.name}
					/>
				</span>
				<span className="hidden lg:flex truncate min-w-0 items-center pl-1 justify-center">
					{hall_id ?? "file has not been saved"}
				</span>
				<span className="flex items-center justify-center pl-1 border-r-[1px] border-gray-400">
					{/* potential performance bug
						TODO: keep track of capacity internaly with each hall section
					*/}
					{
						tempHall.sections
							.map((section) => {
								let a = section.seats.flat()
								return a
							})
							.flat()
							.filter((seat) => seat.inGoodCondition).length
					}
					<PersonIcon
						style={{
							fontSize: "15px",
						}}
					/>
				</span>
				<span className="flex-1 flex items-center justify-center">
					<span className="hidden lg:flex lg:items-center lg:justify-center">
						{tempHall.size.width.toFixed(0)} x {tempHall.size.height.toFixed(0)}
					</span>
				</span>
				<span
					className="flex gap-2 items-center px-1
					"
				>
					<RemoveIcon
						fontSize="small"
						className="cursor-pointer hover:bg-gray-300 rounded-full"
						onClick={() => {
							setZoomSize((prev) => prev - 0.05)
						}}
					/>
					<div className="w-36 flex items-center">
						<Slider
							size="small"
							onChange={(e) => {
								setZoomSize(e.target.value / 100)
							}}
							valueLabelDisplay="auto"
							defaultValue={zoomSize * 100}
							step={5}
							min={5}
							max={500}
							value={Math.round(zoomSize * 100)}
						/>
					</div>
					<AddIcon
						onClick={() => {
							setZoomSize((prev) => prev + 0.05)
						}}
						fontSize="small"
						className="cursor-pointer hover:bg-gray-300 rounded-full"
					/>
				</span>
				<span className="pl-1 w-[30px] shrink-0 grow-0 flex items-center">
					{(zoomSize * 100).toFixed(0)}%
				</span>
			</div>

			{/* ContextMenu */}
			{activeContextMenu && (
				<div
					className="fixed z-20 w-full h-full"
					onContextMenu={(e) => {
						e.preventDefault()
					}}
					onMouseDown={(e) => {
						setActiveContextMenu(null)
					}}
				>
					<div
						onClick={(e) => {
							e.stopPropagation()
						}}
						style={{
							top: `${activeContextMenu.position.y}px`,
							left: `${activeContextMenu.position.x}px`,
						}}
						className="absolute z-30 bg-white border-gray-400 border"
					>
						<SeatContextMenu seat={activeContextMenu.seat} />
					</div>
				</div>
			)}
		</div>
	)
}

export default HallPage
