import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState, useMemo } from "react"
import * as XLSX from "xlsx"
import { processData } from "../helpers/convertCsvToJson"
import { startArrangement, Hall } from "../sorting_algorithm/adapter"
import "react-dropzone-uploader/dist/styles.css"
//import Dropzone from "react-dropzone-uploader"
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded"
import Form from "../components/FormComponents"
import Modal from "@mui/material/Modal"
import RenderSeats from "../components/RenderSeat"
import axios from "../utils/axios"
import axios2 from "axios"
import Loader from "../components/Loader"
import toast from "react-hot-toast"
import AddIcon from "@mui/icons-material/Add"
import {
	generateSeatingArrangements,
	makeSparse,
	makeSparseAll,
} from "../sorting_algorithm/generateArrangements"
import { Paper } from "@mui/material"
import MovableWrapper from "../components/MovableWrapper"
import RenderSection from "../components/RenderSection"

const Home = () => {
	const [data, setData] = useState([])
	const [sortingType, setSortingType] = useState("")
	const [selectedHalls, setSelectedHalls] = useState([])
	const [sortedArrangement, setSortedArrangement] = useState([])
	const [url, setUrl] = useState("")
	const [error, setError] = useState(false)
	const [colors, setColors] = useState({})
	const [loading, setLoading] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState(null)

	const [activeModal, setActiveModal] = useState("")

	const [halls, setHalls] = useState([])
	const sortedColumns = [
		{ field: "course", flex: 1 },
		{ field: "seatNumber", flex: 1 },
		{ field: "student", flex: 5 },
		{ field: "hallName", flex: 2 },
	]

	const availableSortTypes = ["low", "medium", "strict"]

	const [cache, setCache] = useState({})

	const [selectedHallModels, setSelectedHallModels] = useState([])
	const handleSubmit = async (e) => {
		e.preventDefault()
		// reset each hall

		if (data.length > 0 && sortingType && selectedHalls.length > 0) {
			setSortedArrangement([])
			setError(false)
			try {
				// setSortedArrangement(startArrangement(selectedHalls, data, sortingType))
				setLoading(true)
				const hallModels = await Promise.all(
					selectedHalls.map((hall) => {
						return axios2.get(hall.file.url)
					})
				)

				const arrangementResults = generateSeatingArrangements(
					hallModels.map((hallModel) => hallModel.data),
					data,
					sortingType
				)

				setCache((prev) => ({ ...prev, hallGraphs: arrangementResults, hallModels }))
				displayArrangements(arrangementResults, hallModels)
			} catch (err) {
				toast.error(err.message)
			} finally {
				setLoading(false)
			}
		}
	}

	function displayArrangements(arrangementResults, hallModels) {
		setSelectedHallModels(
			hallModels.map(({ data: hallModel }) => {
				const hallName = hallModel.name
				const hallResults = arrangementResults[hallName].nodes.values()
				for (const seatResult of hallResults) {
					const { id, courses, matricNo } = seatResult.data
					const [row, col] = id.slice(37).split("-").map(Number)
					const sectionId = id.slice(0, 36)
					// console.log(sectionId)
					// console.log(hallModel)
					const section = hallModel.sections.find((section) => section.id === sectionId)
					section.seats[row][col].courses = Array.from(courses)
					section.seats[row][col].matricNo = matricNo
				}

				return hallModel
			})
		)
		// console.log(arrangementResults)
		setSortedArrangement(
			Object.keys(arrangementResults)
				.map((hallName) => Array.from(arrangementResults[hallName].nodes.values()))
				.flat()
				.filter((seat) => seat.data.matricNo)
				.map(({ data: { id, courses, seatNumber, matricNo, hallName } }) => {
					const [row, col] = id.slice(37).split("-").map(Number)
					return {
						course: Array.from(courses).join(", "),
						student: matricNo,
						seatNumber,
						hallName,
					}
				})
		)
	}
	useEffect(async () => {
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

	// generates downloadable csv
	useEffect(() => {
		if (sortedArrangement.length > 0) {
			const keys = Object.keys(sortedArrangement[0])
			const commaSeperatedString = [
				keys.join(","),
				sortedArrangement.map((row) => keys.map((key) => row[key]).join(",")).join("\n"),
			].join("\n")

			const csvBlob = new Blob([commaSeperatedString])
			setUrl(URL.createObjectURL(csvBlob))
		}
	}, [sortedArrangement])

	const reset = () => {
		setUrl("")
		setSortedArrangement([])
	}

	const [fileNames, setFileNames] = useState([])
	const handleFiles = async (files) => {
		let promises = []
		for (const file of files) {
			const reader = new FileReader()
			let res
			promises.push(
				new Promise((resolve) => {
					res = resolve
				})
			)
			reader.onload = (evt) => {
				/* Parse data */
				const bstr = evt.target.result
				const wb = XLSX.read(bstr, { type: "binary" })
				/* Get first worksheet */
				const wsname = wb.SheetNames[0]
				const ws = wb.Sheets[wsname]
				/* Convert array of arrays */
				const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })
				res(data)
			}
			reader.readAsBinaryString(file)
		}
		const allData = await Promise.all(promises)
		const processedData = allData.map((data) => processData(data)).flat()
		setFileNames(files.map((file) => file.name))
		setColors(genColors(processedData))
		setData(processedData)
	}
	return (
		<div className="w-full md:px-5 lg:px-8 space-y-5 pt-8 md:pt-20">
			{/* test */}
			{/* <button
				onClick={async () => {
					setLoading(true)
					await new Promise((resolve) => setTimeout(resolve, 0))
					await makeSparseAll(cache.hallGraphs, cache.hallModels, sortingType)

					if (cache.hallGraphs) displayArrangements(cache.hallGraphs, cache.hallModels)
					setLoading(false)
				}}
			>
				clickme
			</button> */}
			{/* Form input */}

			{/* <div className="px-4 pb-4">
				<form className="" onSubmit={(e) => handleSubmit(e)}>
					<div
						className="gap-6 mt-1"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(min(25rem, 100%), 1fr))",
						}}
					>
		
						<div className="">
							<span className="text-lg  font-semibold text-black/80">Students Data</span>
							<p className="text-sm text-black/50 -mt-1 mb-2 font-semibold">
								Click the plus button to add csv files.
							</p>

							<Form.FileUploadInput
								sources={[
									{
										name: "Cloud",
										list: async () => {
											let response = await axios.get("/api/v1/course")
											return response.data.courses
										},
										getFile: async (fileEntry) => {
											let response = await axios2.get(fileEntry.file.url)
											return new File([response.data], fileEntry.name, {})
										},
									},
								]}
								accept={[".csv"]}
								onChange={(files) => {
									reset()
									handleFiles(files)
								}}
							></Form.FileUploadInput>
						</div>

				
						<div className="">
							<span className="text-lg font-semibold text-black/80">Halls</span>
							<p className="text-sm text-black/50 -mt-1 mb-2 font-semibold">
								Select halls to be used by clicking on the desired hall.
							</p>
							<Form.MultipleOptionInput
								onChange={(value) => {
									reset()
									setSelectedHalls(value)
								}}
							>
								{halls.map((hall, index) => {
									return (
										<Form.Option key={index} value={hall}>
											<div className="text-center">
												<h2>{hall.name}</h2>
												<h3 className="text-lg">{hall.capacity}</h3>
											</div>
										</Form.Option>
									)
								})}
							</Form.MultipleOptionInput>
						</div>

					
						<div className="">
							<span className="text-lg font-semibold text-black/80">Arrangement Type</span>
							<p className="text-sm text-black/50 -mt-1 mb-2 font-semibold">
								Select arrangement type to be used by clicking on the desired arrangement type.
							</p>
							<Form.SingleOptionInput
								value={sortingType}
								onChange={(value) => {
									reset()
									setSortingType(value)
								}}
							>
								{availableSortTypes.map((type, index) => {
									return (
										<Form.Option key={index} value={type}>
											{type}
										</Form.Option>
									)
								})}
							</Form.SingleOptionInput>
						</div>
					</div>
					<button
						disabled={!(data.length > 0 && sortingType && selectedHalls.length > 0)}
						className="mt-8 py-2 px-10 mx-auto block bg-black/90 font-semibold disabled:bg-black/40 text-white rounded-xl cursor-pointer"
					>
						Generate
					</button>
				</form>
			</div> */}

			{/* End Form input */}

			<form className="w-full space-y-8 md:space-y-16" onSubmit={handleSubmit}>
				<div className="[&>*]:cursor-pointer flex md:flex-row flex-col justify-between items-center gap-4 px-1 md:p-0">
					<div className="relative bg-white border text-black/50 border-gray-300 rounded-lg  h-[140px] w-full md:w-[90%] md:max-w-[260px] overflow-auto">
						{fileNames.length > 0 ? (
							<div className="flex flex-col items-center gap-y-2 p-1 cursor-default">
								{fileNames.map((name, idx) => (
									<div key={idx} className="text-black/70 w-full bg-gray-100 p-2 rounded-md">
										{name}
									</div>
								))}
							</div>
						) : (
							<div className="flex items-center text-center justify-center flex-col gap-y-2 h-full">
								<AddIcon fontSize="large" />
								<span>Upload student data</span>
							</div>
						)}
						<div
							className={
								fileNames.length > 0
									? "relative w-max mx-auto"
									: "[&>span]:hidden absolute top-0 left-0 w-full h-full"
							}
						>
							<span className="text-2xl px-8 bg-primarydark/80 rounded-md text-white">+</span>
							<div className="absolute top-0 left-0 opacity-0 w-full h-full">
								<Form.FileUploadInput
									sources={[
										{
											name: "Cloud",
											list: async () => {
												let response = await axios.get("/api/v1/course")
												return response.data.courses
											},
											getFile: async (fileEntry) => {
												let response = await axios2.get(fileEntry.file.url)
												return new File([response.data], fileEntry.name, {})
											},
										},
									]}
									accept={[".csv"]}
									onChange={(files) => {
										reset()
										handleFiles(files)
									}}
								></Form.FileUploadInput>
							</div>
						</div>
					</div>
					<div className="bg-white border text-black/50 border-gray-300 rounded-lg  h-[140px] w-full md:w-[90%] md:max-w-[260px] overflow-auto">
						{selectedHalls.length > 0 ? (
							<div className="flex flex-col items-center gap-y-2 p-1 cursor-default">
								{selectedHalls.map((hall, idx) => {
									return (
										<div key={idx} className="text-black/70 w-full bg-gray-100 p-2 rounded-md">
											{hall.name}
										</div>
									)
								})}
								<button
									type="button"
									onClick={() => setActiveModal("hallSelect")}
									className="text-2xl px-8 bg-primarydark/80 rounded-md text-white"
								>
									+
								</button>
							</div>
						) : (
							<div
								onClick={() => setActiveModal("hallSelect")}
								className="flex items-center text-center justify-center flex-col gap-y-2 h-full"
							>
								<AddIcon fontSize="large" />
								<span>Select Halls</span>
							</div>
						)}
					</div>
					<div className="bg-white border text-black/50 border-gray-300 rounded-lg  h-[140px] w-full md:w-[90%] md:max-w-[260px] overflow-auto">
						{sortingType ? (
							<div className="flex flex-col items-center gap-y-2 p-1 cursor-default">
								<div className="text-black/70 w-full bg-gray-100 p-2 rounded-md">{sortingType}</div>
								<button
									type="button"
									onClick={() => setActiveModal("arrangementSelect")}
									className="text-2xl px-8 bg-primarydark/80 rounded-md text-white"
								>
									+
								</button>
							</div>
						) : (
							<div
								onClick={() => setActiveModal("arrangementSelect")}
								className="flex items-center text-center justify-center flex-col gap-y-2 h-full"
							>
								<AddIcon fontSize="large" />
								<span>Arrangement Type</span>
							</div>
						)}
					</div>
				</div>

				<input
					disabled={data.length === 0 || selectedHalls.length === 0 || !sortingType}
					type="submit"
					value="Generate"
					className="bg-primarydark/90 disabled:bg-primarydark/40 cursor-pointer rounded-lg disabled:cursor-not-allowed text-white font-semibold px-10 py-2 mx-auto block"
				/>
			</form>
			{/* Output */}

			<div className="pb-20 px-1">
				<h2 className="text-lg  font-semibold text-black/80 px-3">Results</h2>
				<div className="bg-white border-gray-300 border space-y-8 rounded-lg py-4 px-1 min-h-[60vh] relative">
					{/* New matrix rep*/}
					{sortedArrangement.length > 0 && (
						<div className="px-3">
							<div className="w-h max-w-[100px] py-3">
								{Object.entries(colors).map((color, idx) => {
									return (
										<div className="flex justify-between items-center" key={idx}>
											<span className="text-sm font-semibold text-black/80">{color[0]}</span>{" "}
											<span className="w-3 h-3" style={{ backgroundColor: color[1] }}></span>
										</div>
									)
								})}
							</div>
							<div className="flex overflow-auto gap-8 py-2 px-4">
								{selectedHallModels.map((hall, idx) => {
									return (
										<div className="flex-shrink-0" key={idx}>
											<h2 className="text-xl font-semibold text-black/80 mb-2">{hall.name}</h2>
											<Paper
												elevation={4}
												square
												style={{
													width: `${hall.size.width}px`,
													height: `${hall.size.height}px`,
												}}
												className="overflow-hidden relative border-[1px] border-gray-400"
											>
												{hall.sections.map((section) => (
													<MovableWrapper
														key={section.id}
														position={section.position}
														rotation={section.rotation}
													>
														<RenderSection
															colors={colors}
															section={section}
															onClick={(seat) => {
																setSelectedStudent(seat)
															}}
														/>
													</MovableWrapper>
												))}
											</Paper>
										</div>
									)
								})}
							</div>
						</div>
					)}

					{/* Table */}
					{sortedArrangement.length > 0 && (
						<div className="h-screen py-5 w-full">
							<DataGrid
								sx={{ fontFamily: "Montserrat" }}
								rows={sortedArrangement}
								columns={sortedColumns}
								getRowId={(row) => row.student}
							/>
						</div>
					)}
					{sortedArrangement.length === 0 && (
						<div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-[20px] font-medium text-[#727070]">
							Click Generate to see results
						</div>
					)}
				</div>
			</div>
			{/* Download  */}
			{url && (
				<a
					className="fixed  bottom-4 right-3 p-0.5 px-3 rounded-md  bg-black/60 text-white cursor-pointer"
					href={url}
					download="sorted.csv"
				>
					<FileDownloadRoundedIcon />
				</a>
			)}
			<Modal
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "1rem",
				}}
				onClose={() => {
					setActiveModal("")
				}}
				open={Boolean(activeModal)}
			>
				<div className="w-full px-5 max-w-md font-inter focus:outline-none">
					{activeModal === "arrangementSelect" ? (
						<div className="bg-white rounded-lg p-6">
							<h2 className="section-title pl-0">Arrangement Type</h2>
							<form
								className="w-full max-w-lg"
								onSubmit={(e) => {
									e.preventDefault()
									const formData = new FormData(e.target)
									const arrangementType = formData.get("arrangementType")
									setSortingType(arrangementType)
									setActiveModal("")
									reset()
								}}
							>
								<div className="space-y-3 border border-black/20 rounded-xl p-4">
									<div className="flex gap-x-2 items-center text-black/60">
										<input type="radio" name="arrangementType" id="low_arrangement" value={"low"} />
										<label htmlFor="low_arrangement">Low</label>
									</div>
									<div className="flex gap-x-2 items-center text-black/60">
										<input
											type="radio"
											name="arrangementType"
											id="medium_arrangement"
											value="medium"
										/>
										<label htmlFor="medium_arrangement">Medium</label>
									</div>
									<div className="flex gap-x-2 items-center text-black/60">
										<input
											type="radio"
											name="arrangementType"
											id="strict_arrangement"
											value={"strict"}
										/>
										<label htmlFor="strict_arrangement">Strict</label>
									</div>
								</div>
								<input
									type="submit"
									className="bg-primarydark/90 rounded-md disabled:cursor-not-allowed text-white text-sm font-semibold w-[75%] py-3 mt-8 mx-auto block"
									value="Select"
								/>
							</form>
						</div>
					) : activeModal === "hallSelect" ? (
						<div className="bg-white rounded-lg p-6">
							<h2 className="section-title pl-0">Select Hall</h2>
							<form
								className="w-full max-w-lg"
								onSubmit={(e) => {
									e.preventDefault()
									const formData = new FormData(e.target)
									let selected = []
									for (const entry of formData.entries()) {
										selected.push(halls.find((hall) => hall.id === entry[1]))
									}
									setSelectedHalls(selected)
									setActiveModal("")
									reset()
								}}
							>
								<div className="max-h-[500px] overflow-auto space-y-3 border border-black/20 rounded-xl p-4">
									{halls.map((hall) => {
										return (
											<div key={hall.id} className="flex gap-x-2 items-center text-black/60">
												<input type="checkbox" name="selectHall" id={hall.id} value={hall.id} />
												<label htmlFor={hall.id}>
													{hall.name} {hall.capacity}
												</label>
											</div>
										)
									})}
								</div>
								<input
									type="submit"
									className="bg-primarydark/90 rounded-md disabled:cursor-not-allowed text-white text-sm font-semibold w-[75%] py-3 mt-8 mx-auto block"
									value="Select"
								/>
							</form>
						</div>
					) : (
						<></>
					)}
				</div>
			</Modal>
			<Modal
				open={selectedStudent != null}
				onClose={() => {
					setSelectedStudent(null)
				}}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div className="rounded-md bg-white outline-none px-4">
					<div className="p-3 flex flex-col gap-2">
						{selectedStudent &&
							Object.entries(selectedStudent)
								.filter((entry) => !["flags", "position", "constraints"].includes(entry[0]))
								.map((entry, idx) => {
									return (
										<span key={idx} className="text-sm flex flex-col text-center">
											<span className="font-semibold">{entry[0]}</span>
											<span> {String(entry[1])}</span>
										</span>
									)
								})}
					</div>
				</div>
			</Modal>
			<Loader open={loading} />
		</div>
	)
}

const genRandomColor = () => {
	const codex = "123456789abcdef"
	let color = ["#"]
	for (let i = 0; i < 6; i++) {
		color.push(codex[Math.floor(Math.random() * codex.length)])
	}

	return color.join("")
}

const genColors = (data) => {
	const colors = {}
	data.forEach((d) => {
		if (!colors.hasOwnProperty(d.course)) {
			colors[d.course] = genRandomColor()
		}
	})
	colors.None = "#88b8eb"
	return colors
}

export default Home
