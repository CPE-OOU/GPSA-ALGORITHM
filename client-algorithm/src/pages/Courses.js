import { Modal } from "@mui/material"
import React from "react"
import toast, { ToastBar } from "react-hot-toast"
import Form from "../components/FormComponents"
import Loader from "../components/Loader"
import Table from "../components/Table"
import TableDisplay from "../components/TableDisplay"
import axios from "../utils/axios"

const Courses = () => {
	// const [files, setFiles] = React.useState([])

	const [courseTitle, setCourseTitle] = React.useState("")
	const [courseCode, setCourseCode] = React.useState("")
	const [lecturer, setLecturer] = React.useState("")
	const [courseLevel, setCourseLevel] = React.useState("")
	const [courseFile, setCourseFile] = React.useState(null)
	const [loading, setLoading] = React.useState(false)

	const [courses, setCourses] = React.useState([])

	const [newCourseModalOpen, setNewCourseModalOpen] = React.useState(false)

	React.useEffect(async () => {
		try {
			setLoading(true)
			let response = await axios.get("/api/v1/course")
			setCourses(response.data.courses)
		} catch (error) {
			toast.error("Failed to load courses")
		} finally {
			setLoading(false)
		}
		return () => {}
	}, [])
	async function handleFormSubmit(e) {
		e.preventDefault()
		try {
			let formData = new FormData()
			formData.append("name", courseTitle)
			formData.append("level", courseLevel)
			formData.append("lecturer", lecturer)
			formData.append("code", courseCode)
			formData.append("course_file", courseFile)
			setLoading(true)
			let response = await axios.post("/api/v1/course", formData)
			setCourses((prev) => [response.data, ...prev])
			toast.success("New course created")
		} catch (error) {
			toast.error("Failed to create new course")
		} finally {
			setLoading(false)
		}
	}
	async function deleteCourse(course) {
		try {
			setLoading(true)
			let response = await axios.delete(`/api/v1/course/${course.id}`)
			setCourses((prev) => {
				return prev.filter((c) => c.id !== course.id)
			})
		} catch (error) {
			toast.error("Failed to delete course")
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="w-full pt-2 pb-20">
			<h2 className="section-title">Course Files</h2>
			<TableDisplay
				labels={["Course Code", "Course Title", "Lecturer", "Level"]}
				rows={courses}
				formatRow={(row) => {
					let ret = []

					ret.push(row.code)
					ret.push(row.name)
					ret.push(row.lecturer)
					ret.push(row.level)
					return ret
				}}
				addNew="+ Add new course"
				onRowClick={(row) => {
					console.log(row)
				}}
				onNew={() => {
					setNewCourseModalOpen(true)
				}}
				onDelete={(row) => {
					deleteCourse(row)
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
					setNewCourseModalOpen(false)
				}}
				open={newCourseModalOpen}
			>
				<div className="w-full px-5 max-w-md font-inter">
					<div className="bg-white rounded-lg p-6">
						<h2 className="section-title pl-0">Add new course</h2>
						<form className="w-full max-w-lg" onSubmit={handleFormSubmit}>
							<div className="space-y-4">
								<div className="form-option ">
									<label htmlFor="courseTitle" className="field-title">
										Course Title
									</label>
									<input
										value={courseTitle}
										onChange={(e) => {
											setCourseTitle(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="text"
										name="courseTitle"
										id="courseTitle"
									/>
								</div>
								<div className="form-option ">
									<label htmlFor="courseCode" className="field-title">
										Course Code
									</label>
									<input
										value={courseCode}
										onChange={(e) => {
											setCourseCode(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="text"
										name="courseCode"
										id="courseCode"
									/>
								</div>
								<div className="form-option ">
									<label htmlFor="lecturer" className="field-title">
										Lecturer
									</label>
									<input
										value={lecturer}
										onChange={(e) => {
											setLecturer(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="text"
										name="lecturer"
										id="lecturer"
									/>
								</div>
								<div className="form-option ">
									<label htmlFor="level" className="field-title">
										Level
									</label>
									<input
										value={courseLevel}
										onChange={(e) => {
											setCourseLevel(e.target.value)
										}}
										className="form-input placeholder:text-sm"
										type="text"
										name="level"
										id="level"
									/>
								</div>
								<div className="form-option ">
									<label htmlFor="courseData" className="field-title">
										Course File
									</label>
									<div className="flex w-full items-center gap-x-2 -mt-4">
										<div className="w-10 overflow-hidden relative">
											<span className="relative top-[18px] left-[10px] text-3xl font-semibold">
												+
											</span>
											<input
												onChange={(e) => {
													setCourseFile(e.target.files[0])
												}}
												accept=".csv"
												type="file"
												name="courseData"
												id="courseData"
												className="opacity-0"
											/>
										</div>
										<div className="flex-1 min-w-0 truncate">
											{courseFile?.name || "no file selected."}
										</div>
									</div>
								</div>
							</div>
							<input
								disabled={!courseLevel || !courseCode || !courseTitle || !courseFile}
								type="submit"
								className="bg-primarydark rounded-md disabled:cursor-not-allowed text-white text-sm font-semibold w-[75%] py-3 mt-8 mx-auto block"
								value="Register Course"
							/>
						</form>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default Courses
