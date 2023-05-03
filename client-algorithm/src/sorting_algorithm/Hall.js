import Seat from "./Seat"

class Hall {
	constructor(name, capacity, rowLength, badSeats = []) {
		this.name = name
		this.capacity = capacity
		this.seats = (() => {
			let seats = []
			for (let i = 0; i < capacity; i++) {
				let seat = new Seat()
				seat.setNumber(i + 1)

				seats.push(seat)
			}

			return seats
		})()

		for (const number of badSeats) {
			this.seats[number - 1].inGoodCondition = false
		}
		this.rowLength = rowLength
		this.unplacedStudents = []
	}

	addUnplacedStudents(student) {
		this.unplacedStudents.push(student)
	}

	assignSeats(arr, type) {
		let courses = {}
		// gets the number of students for each course
		arr.forEach((current) => {
			courses.hasOwnProperty(current.course)
				? (courses[current.course] += 1)
				: (courses[current.course] = 1)
		})

		// console.log(courses);
		// sorts out the arr so courses with most students are sorted first
		arr.sort((a, b) => {
			return courses[b.course] - courses[a.course]
		})
		//  console.log(arr);
		arr.forEach((current) => {
			let count = 0
			let left = count - 1
			let right = count + 1
			let bottom = count + this.rowLength
			let top = count - this.rowLength
			// eslint-disable-next-line
			let topLeft = top - 1
			// eslint-disable-next-line no-constant-condition
			let topRight = top + 1

			let bottomLeft = bottom - 1
			let bottomRight = bottom + 1

			while (count <= this.seats.length) {
				if (count < this.seats.length) {
					if (
						this.seats[count].flags.includes(current.course) ||
						this.seats[count].course ||
						!this.seats[count].inGoodCondition
					) {
						left++
						right++
						count++
						top++
						topLeft++
						topRight++
						bottom++
						bottomLeft++
						bottomRight++
					} else {
						break
					}
				} else {
					break
				}
			}
			if (count >= this.seats.length) {
				this.addUnplacedStudents(current)
				// console.log(`${current.student} not placed in ${this.name}`);
			} else {
				switch (type) {
					case "low":
						// sets flag to the left
						left > -1 && this.seats[left].addFlag(current.course)

						// sets flag to the right
						if (right < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[right].addFlag(current.course)
						break
					case "medium":
						// sets flag to the left
						left > -1 && this.seats[left].addFlag(current.course)
						// sets flag to the top
						top > -1 && this.seats[top].addFlag(current.course)

						// sets flag to the bottom
						bottom < this.seats.length && this.seats[bottom].addFlag(current.course)

						// sets flag to the right
						if (right < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[right].addFlag(current.course)
						break
					case "strict":
						// sets flag to the left
						left > -1 && this.seats[left].addFlag(current.course)

						// sets flag to the top
						top > -1 && this.seats[top].addFlag(current.course)

						// sets flag to the bottom
						bottom < this.seats.length && this.seats[bottom].addFlag(current.course)

						// sets flag to the right
						if (right < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[right].addFlag(current.course)

						// sets flag to the topLeft
						// sets flag to the topRight
						// sets flag to the bottomLeft
						if (bottomLeft < this.seats.length && count !== 0 && count % this.rowLength !== 0)
							this.seats[bottomLeft].addFlag(current.course)
						// sets flag to the bottomRight
						if (bottomRight < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[bottomRight].addFlag(current.course)
						break
					default:
				}

				// places current student on the seat
				this.seats[count].student = current.student
				this.seats[count].course = current.course
				// console.log(`${current.student} taking ${current.course} placed in ${this.name} at seat ${count + 1}`);
			}
		})
	}

	assignSeatsImprove(arr, type) {
		let courses = {}
		// gets the number of students for each course
		arr.forEach((current) => {
			courses.hasOwnProperty(current.course)
				? (courses[current.course] += 1)
				: (courses[current.course] = 1)
		})
		// console.log(courses);
		// sorts out the arr so courses with most students are sorted first
		arr.sort((a, b) => {
			return courses[b.course] - courses[a.course]
		})
		//  console.log(arr);
		arr.forEach((current) => {
			let count = 0
			let left = count - 1
			let right = count + 1
			let bottom = count + this.rowLength
			let top = count - this.rowLength
			// eslint-disable-next-line
			let topLeft = top - 1
			// eslint-disable-next-line no-constant-condition
			let topRight = top + 1

			let bottomLeft = bottom - 1
			let bottomRight = bottom + 1

			while (count <= this.seats.length) {
				if (count < this.seats.length) {
					if (
						this.seats[count].flags.includes(current.course) ||
						this.seats[count].course ||
						!this.seats[count].inGoodCondition
					) {
						left++
						right++
						count++
						top++
						topLeft++
						topRight++
						bottom++
						bottomLeft++
						bottomRight++
					} else {
						break
					}
				} else {
					break
				}
			}
			if (count >= this.seats.length) {
				this.addUnplacedStudents(current)
				// console.log(`${current.student} not placed in ${this.name}`);
			} else {
				switch (type) {
					case "low":
						// sets flag to the left
						left > -1 && this.seats[left].addFlag(current.course)

						// sets flag to the right
						if (right < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[right].addFlag(current.course)
						break
					case "medium":
						// sets flag to the left
						left > -1 && this.seats[left].addFlag(current.course)
						// sets flag to the top
						top > -1 && this.seats[top].addFlag(current.course)

						// sets flag to the bottom
						bottom < this.seats.length && this.seats[bottom].addFlag(current.course)

						// sets flag to the right
						if (right < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[right].addFlag(current.course)
						break
					case "strict":
						// sets flag to the left
						left > -1 && this.seats[left].addFlag(current.course)

						// sets flag to the top
						top > -1 && this.seats[top].addFlag(current.course)

						// sets flag to the bottom
						bottom < this.seats.length && this.seats[bottom].addFlag(current.course)

						// sets flag to the right
						if (right < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[right].addFlag(current.course)

						// sets flag to the topLeft
						// sets flag to the topRight
						// sets flag to the bottomLeft
						if (bottomLeft < this.seats.length && count !== 0 && count % this.rowLength !== 0)
							this.seats[bottomLeft].addFlag(current.course)
						// sets flag to the bottomRight
						if (bottomRight < this.seats.length && (count + 1) % this.rowLength !== 0)
							this.seats[bottomRight].addFlag(current.course)
						break
					default:
				}

				// places current student on the seat
				this.seats[count].student = current.student
				this.seats[count].course = current.course
				// console.log(`${current.student} taking ${current.course} placed in ${this.name} at seat ${count + 1}`);
			}
		})
	}

	sortedArrangements() {
		return this.seats
			.map((seat, index) => ({
				course: seat.course,
				seatNumber: index + 1,
				student: seat.student,
				hallName: this.name,
			}))
			.filter((seat) => seat.course !== null)
	}
	reset() {
		this.seats.forEach((seat) => seat.reset())
		this.unplacedStudents = []
	}
}

export default Hall
