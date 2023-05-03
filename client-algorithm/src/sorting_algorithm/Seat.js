class Seat {
	constructor() {
		this.student = null
		this.course = null
		this.flags = []
		this.inGoodCondition = true
		this.number = null
	}
	toggleConditoin() {
		this.inGoodCondition = !this.inGoodCondition
	}

	addFlag(flag) {
		!this.flags.includes(flag) && this.flags.push(flag)
	}

	addCourse(course) {
		this.course = course
	}
	addStudent(student) {
		this.student = student
	}
	reset() {
		this.student = null
		this.course = null
		this.flags = []
	}
	setNumber(number) {
		this.number = number
	}
}

export default Seat
