const studentList = [
	{ course: "CPE 102", student: "001" },
	{ course: "CPE 102", student: "006" },
	{ course: "CPE 102", student: "005" },
	{ course: "CPE 102", student: "004" },
	{ course: "CPE 102", student: "003" },
	{ course: "CPE 102", student: "002" },
	{ course: "CPE 102", student: "010" },
	{ course: "CPE 102", student: "011" },
	{ course: "CPE 102", student: "012" },
	{ course: "CPE 102", student: "014" },
	{ course: "CPE 102", student: "015" },
	{ course: "CPE 102", student: "016" },
	{ course: "CPE 102", student: "017" },
	{ course: "CPE 102", student: "018" },
	{ course: "CPE 102", student: "019" },
	{ course: "CPE 102", student: "020" },
	{ course: "CPE 102", student: "021" },
	{ course: "CPE 102", student: "022" },
	{ course: "CPE 102", student: "023" },
	{ course: "CPE 102", student: "024" },
	{ course: "CPE 102", student: "025" },
	{ course: "CPE 202", student: "009" },
	{ course: "CPE 102", student: "009" },
	{ course: "CPE 202", student: "090" },
]

class EdgeEntry {
	constructor(weight, otherNode) {
		this.weight = weight
		this.otherNode = otherNode
	}
}

class NodeEntry {
	constructor(data) {
		this.data = data
		this.edges = []
	}
}
class Graph {
	constructor() {
		this.nodes = new Map()
	}

	static generateGraphFromHallModel(hallModel) {
		const hallGraph = new Graph()
		hallModel.sections.forEach((section) => {
			section.seats.forEach((row) =>
				row.forEach(({ sectionId, position, seatNumber, inGoodCondition }) => {
					hallGraph.nodes.set(
						`${sectionId}-${position.row}-${position.col}`,
						new NodeEntry({
							seatNumber,
							inGoodCondition,
							id: `${sectionId}-${position.row}-${position.col}`,
							matricNo: null,
							courses: new Set(),
							flags: [],
							hallName: hallModel.name,
						})
					)
				})
			)
		})

		hallGraph.nodes.forEach((value, key) => {
			const sectionId = key.slice(0, 36)
			const [row, col] = key.slice(37).split("-").map(Number)
			const section = hallModel.sections.find((section) => section.id === sectionId)
			const seat = section.seats[row][col]

			if (col - 1 >= 0) {
				value.edges.push(new EdgeEntry(1, hallGraph.nodes.get(`${sectionId}-${row}-${col - 1}`)))
			}
			if (col + 1 < section.seats[0].length) {
				value.edges.push(new EdgeEntry(1, hallGraph.nodes.get(`${sectionId}-${row}-${col + 1}`)))
			}
			if (row - 1 >= 0) {
				value.edges.push(new EdgeEntry(2, hallGraph.nodes.get(`${sectionId}-${row - 1}-${col}`)))
			}
			if (row + 1 < section.seats.length) {
				value.edges.push(new EdgeEntry(2, hallGraph.nodes.get(`${sectionId}-${row + 1}-${col}`)))
			}

			if (col - 1 >= 0 && row - 1 >= 0) {
				value.edges.push(
					new EdgeEntry(3, hallGraph.nodes.get(`${sectionId}-${row - 1}-${col - 1}`))
				)
			}
			if (col + 1 < section.seats[0].length && row - 1 >= 0) {
				value.edges.push(
					new EdgeEntry(3, hallGraph.nodes.get(`${sectionId}-${row - 1}-${col + 1}`))
				)
			}
			if (col - 1 >= 0 && row + 1 < section.seats.length) {
				value.edges.push(
					new EdgeEntry(3, hallGraph.nodes.get(`${sectionId}-${row + 1}-${col - 1}`))
				)
			}
			if (col + 1 < section.seats[0].length && row + 1 < section.seats.length) {
				value.edges.push(
					new EdgeEntry(3, hallGraph.nodes.get(`${sectionId}-${row + 1}-${col + 1}`))
				)
			}
			Object.keys(seat.constraints).forEach((level) => {
				seat.constraints[level].forEach(({ sectionId, row, col }) => {
					value.edges.push(
						new EdgeEntry(+level + 1, hallGraph.nodes.get(`${sectionId}-${row}-${col}`))
					)
				})
			})
		})
		return hallGraph
	}
	traverse(callback) {
		const visitedNodes = new Set()

		function __traverse(node) {
			if (visitedNodes.has(node)) {
				return
			}
			callback(node)
			visitedNodes.add(node)
			node.edges.forEach((edge) => {
				__traverse(edge.otherNode)
			})
		}

		for (const [_, value] of this.nodes) {
			__traverse(value)
		}
	}

	async traverseAsync(callback) {
		const visitedNodes = new Set()

		async function __traverse(node) {
			if (visitedNodes.has(node)) {
				return
			}
			await callback(node)
			visitedNodes.add(node)
			for (let i = 0; i < node.edges.length; i++) {
				await __traverse(node.edges[i].otherNode)
			}
		}

		for (const [_, value] of this.nodes) {
			await __traverse(value)
		}
	}
}

export function generateSeatingArrangements(hallModels, studentList, arrangementType) {
	const spread = { low: 1, medium: 2, strict: 3 }[arrangementType]
	const studentListMap = new Map()

	for (const student of studentList) {
		const studentEntry = studentListMap.get(student.student)
		if (studentEntry) {
			studentEntry.courses.push(student.course)
		} else {
			studentListMap.set(student.student, { matricNo: student.student, courses: [student.course] })
		}
	}

	const courses = {}
	for (const studentEntry of studentListMap.values()) {
		if (!courses[studentEntry.courses[0]]) {
			courses[studentEntry.courses[0]] = new Array()
		}
		courses[studentEntry.courses[0]].push({
			matricNo: studentEntry.matricNo,
			otherCourses: studentEntry.courses.slice(1),
		})
	}

	const hallGraphs = {}

	hallModels.forEach((hallModel) => {
		hallGraphs[hallModel.name] = Graph.generateGraphFromHallModel(hallModel)
	})

	// 1
	/*
	for (const hallModel of hallModels) {
		if (Object.keys(courses).every((course) => courses[course].length === 0)) {
			break
		}
		const hallGraph = hallGraphs[hallModel.name]
		let ratio = Object.keys(courses).map((course) => {
			return [course, courses[course].length]
		})
		const minCourseTaken = Math.min(...ratio.map((r) => r[1]))

		// ratio = ratio.map((r) => [r[0], Math.round(r[1] / minCourseTaken)])
		ratio.sort((a, b) => {
			return b[1] - a[1]
		})
		const courseLastPos = {}
		while (true) {
			ratio.forEach((courseRatio) => {
				const min = Math.min(courseRatio[1], courses[courseRatio[0]].length)
				for (let i = 0; i < min; i++) {
					if (courseLastPos[courseRatio[0]] && courseLastPos[courseRatio[0]].done) {
						return
					}
					const studentData = courses[courseRatio[0]][0]
					studentData.otherCourses.push(courseRatio[0])

					let chosenSeat = null
					hallGraph.traverse((node) => {
						if (node.data.matricNo || !node.data.inGoodCondition) {
							return
						} else if (studentData.otherCourses.some((course) => node.data.flags.has(course))) {
							return
						} else {
							let affectedSeatCount = 0

							const sectionId = node.data.id.slice(0, 36)
							const [row, col] = node.data.id.slice(37).split("-").map(Number)

							const section = hallModel.sections.find((section) => sectionId === section.id)

							let seatXPos = section.position.x + col * 40 + 20
							let seatYPos = section.position.y + row * 20

							// handle sections with rotation
							const DegToRad = Math.PI / 180
							const thetha = section.rotation * DegToRad
							const deltaX = seatXPos - section.position.x
							const deltaY = seatYPos - section.position.y
							const distanceToStart = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
							const tau = Math.asin(deltaX / distanceToStart)

							const beta = thetha - tau

							seatXPos = section.position.x - Math.sin(beta) * distanceToStart
							seatYPos = section.position.y + Math.cos(beta) * distanceToStart

							// end
							const distanceToNearestInvigilator = Math.min(
								...hallModel.invigilatorSpots.map((invigilatorSpot) => {
									const x = Math.abs(seatXPos - invigilatorSpot.position.x + 8)
									const y = Math.abs(seatYPos - invigilatorSpot.position.y + 8)
									return Math.sqrt(x * x + y * y)
								})
							)
							node.edges.forEach((edge) => {
								if (
									!studentData.otherCourses.every((course) =>
										edge.otherNode.data.flags.has(course)
									) &&
									!edge.otherNode.data.matricNo &&
									edge.otherNode.data.inGoodCondition
								) {
									affectedSeatCount++
								}
							})
							if (!chosenSeat) {
								chosenSeat = { seat: node, affectedSeatCount, distanceToNearestInvigilator }
							} else if (affectedSeatCount < chosenSeat.affectedSeatCount) {
								chosenSeat = { seat: node, affectedSeatCount, distanceToNearestInvigilator }
							} else if (
								affectedSeatCount === chosenSeat.affectedSeatCount &&
								distanceToNearestInvigilator < chosenSeat.distanceToNearestInvigilator
							) {
								chosenSeat = { seat: node, affectedSeatCount, distanceToNearestInvigilator }
							}
						}
					})

					if (!courseLastPos[courseRatio[0]]) {
						courseLastPos[courseRatio[0]] = {}
					}
					if (!chosenSeat) {
						courseLastPos[courseRatio[0]].done = true
					} else {
						// console.log(chosenSeat.seat.data.id, studentData.otherCourses)
						chosenSeat.seat.data.matricNo = studentData.matricNo
						chosenSeat.seat.data.courses = studentData.otherCourses

						chosenSeat.seat.edges.forEach((edge) => {
							if (!edge.otherNode.data.matricNo) {
								studentData.otherCourses.forEach((course) => {
									edge.otherNode.data.flags.add(course)
								})
							}
						})

						courses[courseRatio[0]] = courses[courseRatio[0]].filter(
							({ matricNo }) => matricNo !== studentData.matricNo
						)
					}
				}
			})

			if (
				Object.keys(courses).every((course) => {
					return (
						courses[course].length === 0 || (courseLastPos[course] && courseLastPos[course].done)
					)
				})
			) {
				break
			}
		}
	}
*/
	// 1 end
	// test

	let ratio = Object.keys(courses).map((course) => {
		return [course, courses[course].length]
	})
	const minCourseTaken = Math.min(...ratio.map((r) => r[1]))

	ratio = ratio.map((r) => [r[0], Math.round(r[1] / minCourseTaken)])
	ratio.sort((a, b) => {
		return b[1] - a[1]
	})
	const courseLastPos = {}
	while (true) {
		ratio.forEach((courseRatio) => {
			const min = Math.min(courseRatio[1], courses[courseRatio[0]].length)
			for (let i = 0; i < min; i++) {
				if (courseLastPos[courseRatio[0]] && courseLastPos[courseRatio[0]].done) {
					return
				}
				const studentData = courses[courseRatio[0]][0]
				studentData.otherCourses.push(courseRatio[0])

				let chosenSeat = null

				for (const hallModel of hallModels) {
					const hallGraph = hallGraphs[hallModel.name]
					hallGraph.traverse((node) => {
						if (node.data.matricNo || !node.data.inGoodCondition) {
							return
						} else if (
							studentData.otherCourses.some((course) => node.data.flags.includes(course))
						) {
							return
						} else {
							let affectedSeatCount = 0

							const sectionId = node.data.id.slice(0, 36)
							const [row, col] = node.data.id.slice(37).split("-").map(Number)

							const section = hallModel.sections.find((section) => sectionId === section.id)

							let seatXPos = section.position.x + col * 40 + 20
							let seatYPos = section.position.y + row * 20

							// handle sections with rotation
							const DegToRad = Math.PI / 180
							const thetha = section.rotation * DegToRad
							const deltaX = seatXPos - section.position.x
							const deltaY = seatYPos - section.position.y
							const distanceToStart = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
							const tau = Math.asin(deltaX / distanceToStart)

							const beta = thetha - tau

							seatXPos = section.position.x - Math.sin(beta) * distanceToStart
							seatYPos = section.position.y + Math.cos(beta) * distanceToStart

							// end
							const distanceToNearestInvigilator = Math.min(
								...hallModel.invigilatorSpots.map((invigilatorSpot) => {
									const x = Math.abs(seatXPos - invigilatorSpot.position.x + 8)
									const y = Math.abs(seatYPos - invigilatorSpot.position.y + 8)
									return Math.sqrt(x * x + y * y)
								})
							)
							node.edges
								.filter((edge) => edge.weight <= spread)
								.forEach((edge) => {
									if (
										!studentData.otherCourses.every((course) =>
											edge.otherNode.data.flags.includes(course)
										) &&
										!edge.otherNode.data.matricNo &&
										edge.otherNode.data.inGoodCondition
									) {
										affectedSeatCount++
									}
								})

							// soft constraint
							if (affectedSeatCount < 2 && spread === 2) {
								affectedSeatCount++
							}
							//

							if (!chosenSeat) {
								chosenSeat = { seat: node, affectedSeatCount, distanceToNearestInvigilator }
							} else if (affectedSeatCount < chosenSeat.affectedSeatCount) {
								chosenSeat = { seat: node, affectedSeatCount, distanceToNearestInvigilator }
							} else if (
								affectedSeatCount === chosenSeat.affectedSeatCount &&
								distanceToNearestInvigilator < chosenSeat.distanceToNearestInvigilator
							) {
								chosenSeat = { seat: node, affectedSeatCount, distanceToNearestInvigilator }
							}
						}
					})
				}
				if (!courseLastPos[courseRatio[0]]) {
					courseLastPos[courseRatio[0]] = {}
				}
				if (!chosenSeat) {
					courseLastPos[courseRatio[0]].done = true
				} else {
					chosenSeat.seat.data.matricNo = studentData.matricNo
					chosenSeat.seat.data.courses = new Set(studentData.otherCourses)

					chosenSeat.seat.edges
						.filter((edge) => edge.weight <= spread)
						.forEach((edge) => {
							// if (!edge.otherNode.data.matricNo) {
							studentData.otherCourses.forEach((course) => {
								edge.otherNode.data.flags.push(course)
							})
							// }
						})

					courses[courseRatio[0]] = courses[courseRatio[0]].filter(
						({ matricNo }) => matricNo !== studentData.matricNo
					)
				}
			}
		})

		if (
			Object.keys(courses).every((course) => {
				return courses[course].length === 0 || (courseLastPos[course] && courseLastPos[course].done)
			})
		) {
			break
		}
	}

	// test end

	if (!Object.keys(courses).every((course) => courses[course].length === 0)) {
		throw new Error(
			`There are ${Object.keys(courses).reduce(
				(total, course) => total + courses[course].length,
				0
			)} student(s) left to be placed, try lowering the placement constraints or use more halls.`
		)
	}
	return hallGraphs
}

export function verifySeatNumbersConstraints(hallModel) {
	const verifiedSeatNumbers = new Set()

	// ensure all seats number are unique
	// ensure all seats have numbers
	hallModel.sections.forEach((section) => {
		section.seats.forEach((row) => {
			row.forEach((seat) => {
				if (!seat.seatNumber) {
					throw new Error("not all seats have been assigned seat numbers")
				}
				if (verifiedSeatNumbers.has(seat.seatNumber)) {
					throw new Error("duplicate seat numbers")
				}
				verifiedSeatNumbers.add(seat.seatNumber)
			})
		})
	})
}

/*
hallGraphs{}
	keys {hallname}
	values ->
		nodes{Map} -> 
			keys {sectionId-row-col}
			values ->
				edges[] ->
					weight
					otherNode ->
				data ->
					seatNumber
					id {sectionId-row-col}
					matricNo
					moved
					courses set
					flags []
					hallName

*/

function averageSeatDistance(hallGraph) {
	let count = 0
	let sum = 0
	hallGraph.traverse((node) => {
		if (node.data.matricNo) {
			sum += node.edges.filter(({ otherNode }) => otherNode.data.matricNo).length
			count += 1
		}
	})
	return sum / count
}

function averageSeatDistanceAll(hallGraphs) {
	let count = 0
	let sum = 0
	for (const hallGraph of Object.values(hallGraphs)) {
		hallGraph.traverse((node) => {
			if (node.data.matricNo) {
				sum += node.edges.filter(({ otherNode }) => otherNode.data.matricNo).length
				count += 1
			}
		})
	}
	return sum / count
}

export async function makeSparseAll(hallGraphs, hallModels, spread) {
	spread = { low: 1, medium: 2, strict: 3 }[spread]

	let aSD = averageSeatDistanceAll(hallGraphs)
	console.log(aSD)

	for (const hallGraph of Object.values(hallGraphs)) {
		await hallGraph.traverseAsync(async (node) => {
			if (!node.data.matricNo || node.data.moved) return

			let newLocation = null
			for (const hallGraph_ of Object.values(hallGraphs)) {
				await new Promise((res) => setTimeout(res, 0))
				await hallGraph_.traverseAsync(async (node_) => {
					if (
						node === node_ ||
						node_.data.matricNo ||
						!Array.from(node.data.courses).every((course) => !node_.data.flags.includes(course))
					)
						return
					node_.data.matricNo = node.data.matricNo
					node.data.matricNo = null

					const newASD = averageSeatDistanceAll(hallGraphs)
					if (newASD < aSD) {
						aSD = newASD
						newLocation = node_
					}

					node.data.matricNo = node_.data.matricNo
					node_.data.matricNo = null
				})
			}
			if (!newLocation) return
			node.edges
				.filter(({ weight }) => weight <= spread)
				.forEach(({ otherNode }) =>
					node.data.courses.forEach((course) => {
						otherNode.data.flags.splice(
							otherNode.data.flags.findIndex((flag) => flag === course),
							1
						)
					})
				)

			// relocate properties
			newLocation.data.matricNo = node.data.matricNo
			node.data.matricNo = null
			newLocation.data.courses = node.data.courses
			node.data.courses = new Set()
			newLocation.data.moved = true

			// set flags in new location
			newLocation.edges
				.filter(({ weight }) => weight <= spread)
				.forEach(({ otherNode }) =>
					newLocation.data.courses.forEach((course) => otherNode.data.flags.push(course))
				)
		})
	}
	console.log(aSD)
}
export function makeSparse(hallGraphs, hallModels, spread) {
	spread = { low: 1, medium: 2, strict: 3 }[spread]
	for (const [hallName, hallGraph] of Object.entries(hallGraphs)) {
		let aSD = averageSeatDistance(hallGraph)
		console.log(`${hallName}: ${aSD}`)

		hallGraph.traverse((node) => {
			if (!node.data.matricNo || node.data.moved) return

			let newLocation = null
			hallGraph.traverse((node_) => {
				if (
					node === node_ || //
					node_.data.matricNo || // if someone on seat already
					!Array.from(node.data.courses).every((course) => !node_.data.flags.includes(course)) // if seat flags allow the course
				)
					return

				node_.data.matricNo = node.data.matricNo
				node.data.matricNo = null
				const newASD = averageSeatDistance(hallGraph)
				if (newASD < aSD) {
					aSD = newASD
					newLocation = node_
				}

				node.data.matricNo = node_.data.matricNo
				node_.data.matricNo = null
			})
			//relocation
			// remove all flags set by the node in the old location

			if (!newLocation) return
			node.edges
				.filter(({ weight }) => weight <= spread)
				.forEach(({ otherNode }) =>
					node.data.courses.forEach((course) => {
						otherNode.data.flags.splice(
							otherNode.data.flags.findIndex((flag) => flag === course),
							1
						)
					})
				)

			// relocate properties
			newLocation.data.matricNo = node.data.matricNo
			node.data.matricNo = null
			newLocation.data.courses = node.data.courses
			node.data.courses = new Set()
			newLocation.data.moved = true

			// set flags in new location
			newLocation.edges
				.filter(({ weight }) => weight <= spread)
				.forEach(({ otherNode }) =>
					newLocation.data.courses.forEach((course) => otherNode.data.flags.push(course))
				)
			console.log(`${hallName}: ${aSD}`)
		})
	}
}
