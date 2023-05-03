import React, { useEffect } from "react"
import AddIcon from "@mui/icons-material/Add"
import { Badge, Modal } from "@mui/material"
import toast from "react-hot-toast"
import Loader from "./Loader"

const genKey = (() => {
	let start = 0
	return function () {
		start++
		return start
	}
})()

// gridTemplateRows: "repeat(auto-fill, 100px)",
const globalStyle = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(min(6rem, 100%), 1fr))",
	gap: ".5em",
}

const OptionsContainer = ({ children }) => {
	return <div style={globalStyle}>{children}</div>
}

const FileUploadInput = ({ accept, onChange, sources }) => {
	const [state, setState] = React.useState([])
	let currentState = state

	const [sourceOptionActive, setSourceOptionActive] = React.useState(false)
	const [sourceFiles, setSourceFiles] = React.useState(null)
	const [selectedSourceFiles, setSelectedSourceFiles] = React.useState([])
	const [sourceId, setSourceId] = React.useState(null)
	const [loading, setLoading] = React.useState(false)
	function handleChange(e) {
		setState((prev) => [...prev, ...e.target.files])
	}

	useEffect(() => {
		onChange && onChange(currentState)
	}, [state])
	return (
		<>
			<div
				className="w-full h-full"
				style={{ ...globalStyle }}
				onClick={(e) => {
					e.preventDefault()
					if (sources) setSourceOptionActive(true)
				}}
			>
				{/* {currentState.map((file) => (
					<div
						key={genKey()}
						onClick={(e) => {
							setState((prev) => prev.filter((curr) => curr !== file))
						}}
					>
						<Option selected={true} value={file.name}>
							{file.name}
						</Option>
					</div>
				))} */}
				<button
					// onClick={(e) => {
					// 	e.preventDefault()
					// 	if (sources) setSourceOptionActive(true)
					// }}
					className="relative overflow-hidden bg-black/10 p-1 rounded-xl border-2 border-black"
				>
					<AddIcon />
					{!sources && (
						<input
							onChange={handleChange}
							className="!cursor-pointer"
							style={{
								opacity: 0,
								width: "100vw",
								height: "100%",
								position: "absolute",
								left: "-120%",
								top: 0,
							}}
							type="file"
							accept={accept?.join(",")}
							multiple={true}
						/>
					)}
				</button>
			</div>
			<Modal
				onClose={() => {
					setSourceOptionActive(false)
					setSourceFiles(null)
					setSelectedSourceFiles([])
				}}
				open={sourceOptionActive}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "1rem",
				}}
			>
				<>
					{!sourceFiles && (
						<div className="bg-white p-2 rounded-md w-full max-w-sm">
							<h2 className="pl-2 font-semibold text-lg">Sources</h2>
							<ul>
								<li className="relative overflow-hidden hover:bg-black/20 p-2 rounded-md">
									Local
									<input
										onChange={handleChange}
										className="!cursor-pointer"
										style={{
											opacity: 0,
											width: "100vw",
											height: "100%",
											position: "absolute",
											left: "-10%",
											top: 0,
										}}
										type="file"
										accept={accept?.join(",")}
										multiple={true}
									/>
								</li>
								{sources.map((source, idx) => {
									return (
										<li
											onClick={async () => {
												try {
													setLoading(true)
													const list = await source.list()
													setSourceId(idx)
													setSourceFiles(list)
												} catch (error) {
													toast.error("Failed to load files")
												} finally {
													setLoading(false)
												}
											}}
											key={idx}
											className="cursor-pointer hover:bg-black/20 p-2 rounded-md"
										>
											{source.name}
										</li>
									)
								})}
							</ul>
						</div>
					)}

					{sourceFiles && (
						<div className="bg-white rounded-md w-full max-w-sm p-2">
							<h2 className="pl-2 font-semibold text-lg">Course Files</h2>
							<p className="pl-2 text-sm -mt-2 mb-2 text-black/50">
								tap on a course file to select it.
							</p>
							<ul className="h-[min(70vh,500px)] overflow-auto space-y-1 px-1">
								{Object.values(
									sourceFiles.reduce((total, cur) => {
										if (!total[cur.level]) total[cur.level] = []
										total[cur.level].push(cur)
										return total
									}, {})
								).map((courseFiles, idx) => {
									return (
										<li key={idx}>
											<details>
												<summary className="cursor-pointer text-lg">
													{courseFiles[0].level} Level
												</summary>
												<ul className="space-y-1 px-1">
													{courseFiles.map((file, idx) => {
														return (
															<li
																key={file.id}
																className={`cursor-pointer p-2 hover:border-black border-transparent border-2 rounded-md ${
																	selectedSourceFiles.includes(file.id) && "bg-black/20"
																}`}
																onClick={() => {
																	if (selectedSourceFiles.includes(file.id)) {
																		setSelectedSourceFiles((prev) =>
																			prev.filter((f) => f !== file.id)
																		)
																	} else {
																		setSelectedSourceFiles((prev) => [...prev, file.id])
																	}
																}}
															>
																{file.name}
															</li>
														)
													})}
												</ul>
											</details>
										</li>
									)
								})}
							</ul>
							{/* <ul className="h-[min(70vh,500px)] overflow-auto space-y-1 px-1">
								{sourceFiles.map((file, idx) => {
									console.log(
										sourceFiles.reduce((total, cur) => {
											if (!total[cur.level]) total[cur.level] = []
											total[cur.level].push(cur)
											return total
										}, {})
									)
									return (
										<li
											key={idx}
											className={`cursor-pointer p-2 hover:border-black border-transparent border-2 rounded-md ${
												selectedSourceFiles.includes(idx) && "bg-black/20"
											}`}
											onClick={() => {
												if (selectedSourceFiles.includes(idx)) {
													setSelectedSourceFiles((prev) => prev.filter((file) => file !== idx))
												} else {
													setSelectedSourceFiles((prev) => [...prev, idx])
												}
											}}
										>
											{file.name}
										</li>
									)
								})}
							</ul> */}
							<button
								onClick={async (e) => {
									e.preventDefault()
									try {
										setLoading(true)
										const currentSource = sources[sourceId]
										let promises = []
										for (const selected of selectedSourceFiles) {
											promises.push(
												currentSource.getFile(sourceFiles.find((file) => file.id === selected))
											)
										}
										let files = await Promise.all(promises)
										handleChange({ target: { files } })
									} catch (error) {
										toast.error("Error fetching files.")
									} finally {
										setLoading(false)

										setSourceOptionActive(false)
										setSourceFiles(null)
										setSelectedSourceFiles([])
									}
								}}
								className="bg-primarydark py-2 px-4 hover:bg-primarydark/60 font-semibold text-sm rounded-md mt-4 block w-full text-white"
							>
								Download {selectedSourceFiles.length + " files"}
							</button>
						</div>
					)}
				</>
			</Modal>
			<Loader open={loading}></Loader>
		</>
	)
}

const MultipleOptionInput = ({ value: parentGivenValue, onChange, children, wrapper: Wrapper }) => {
	const [state, setState] = React.useState([])
	let currentState = parentGivenValue ? parentGivenValue : state

	function handleOptionClick(value) {
		let newState = []
		if (currentState.includes(value)) {
			newState = currentState.filter((i) => value !== i)
		} else {
			newState = [...currentState, value]
		}
		setState(newState)
		if (onChange) {
			onChange(newState)
		}
	}

	if (Wrapper) {
		return <Wrapper></Wrapper>
	}
	return (
		<OptionsContainer>
			{setupChildren(
				(childValue) => currentState.includes(childValue),
				children,
				handleOptionClick
			)}
		</OptionsContainer>
	)
}

const SingleOptionInput = ({ value: parentGivenValue, onChange, children, wrapper: Wrapper }) => {
	const [state, setState] = React.useState("")
	let currentState = parentGivenValue ? parentGivenValue : state

	function handleOptionClick(value) {
		if (onChange) {
			onChange(value)
		}
		if (!parentGivenValue) {
			setState(value)
		}
	}
	if (Wrapper) {
		return (
			<Wrapper>
				{setupChildren((childValue) => childValue === currentState, children, handleOptionClick)}
			</Wrapper>
		)
	}
	return (
		<OptionsContainer>
			{setupChildren((childValue) => childValue === currentState, children, handleOptionClick)}
		</OptionsContainer>
	)
}

function setupChildren(isSelected, children, handleOptionClick) {
	return children
		.filter((child) => child.type === Option)
		.map((child) => {
			return (
				<child.type
					selected={isSelected(child.props.value)}
					key={child.key}
					{...child.props}
					onClick={handleOptionClick}
				/>
			)
		})
}

const Option = ({ onClick, value, children, selected, style }) => {
	const defaultStyle = {
		padding: "10px",
		border: "1px solid transparent",
	}

	return (
		<div
			style={style ? style : {}}
			onClick={() => onClick && onClick(value)}
			className={`text-gray-500  cursor-pointer flex flex-col transition-all justify-center items-center border-dashed border-2 p-2 rounded-md  ${
				selected ? "border-black  bg-black/10 " : ""
			}`}
		>
			<div className="w-full flex justify-between">
				{/* top left */}
				<div></div>
				{/* top middle*/}
				<div></div>
				{/* top right*/}
				<div></div>
			</div>
			<div className="flex-1 w-full flex items-center justify-center">
				<h1 className={`truncate min-w-0 font-medium text-sm ${selected ? "text-black" : ""}`}>
					{children}
				</h1>
			</div>
			<div className="w-full flex justify-between">
				{/* bottom left */}
				<div></div>
				{/* bottom middle*/}
				<div></div>
				{/* bottom right*/}
				<div></div>
			</div>
		</div>
	)
}

export default {
	Option,
	FileUploadInput,
	MultipleOptionInput,
	SingleOptionInput,
}
