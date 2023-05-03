import { v4 as uuidv4 } from "uuid"
export class SeatPosition {
	constructor(row, col) {
		this.row = row
		this.col = col
	}
}

export class Position {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

export class Seat {
	constructor(position, sectionId) {
		this.sectionId = sectionId
		this.position = position
		this.seatNumber = null
		this.inGoodCondition = true
		this.constraints = { 0: [], 1: [], 2: [] }
	}
}

export const PositionRelationships = ["L-R", "R-L", "B-T", "T-B"]

export class Constraint {
	constructor(sectionId, row, col) {
		this.sectionId = sectionId
		this.row = row
		this.col = col
	}
}
export const ConstraintLevel = {
	Low: "0",
	Medium: "1",
	Strict: "2",
}

export class Section {
	constructor(rows, cols, name) {
		this.name = name
		this.id = uuidv4()
		this.seats = Section.generateSeats(rows, cols, this.id)
		this.position = new Position(0, 0)
		this.rotation = 0
		this.relatedSections = []
	}

	static autoConstraint(firstSection, secondSection, autoConstraintEntry) {
		let { rowOneStart, rowOneEnd, rowTwoStart } = autoConstraintEntry

		rowOneStart--
		rowOneEnd--
		rowTwoStart--

		const firstSectionLastCol = firstSection.seats[0].length - 1
		const secondSectionFirstCol = 0
		firstSection.relatedSections.push(secondSection.id)
		secondSection.relatedSections.push(firstSection.id)
		for (
			let row = Math.min(rowOneStart, firstSection.seats.length);
			row < Math.min(firstSection.seats.length, rowOneEnd + 1);
			row++, rowTwoStart++
		) {
			let currentSeat = firstSection.seats[row][firstSectionLastCol]
			//2-top right
			const topRightRow = rowTwoStart - 1
			if (topRightRow >= 0 && topRightRow < secondSection.seats.length) {
				const topRightSeat = secondSection.seats[topRightRow][secondSectionFirstCol]
				currentSeat.constraints[ConstraintLevel.Strict].push(
					new Constraint(secondSection.id, topRightRow, secondSectionFirstCol)
				)
				topRightSeat.constraints[ConstraintLevel.Strict].push(
					new Constraint(firstSection.id, row, firstSectionLastCol)
				)
			}

			//0-right
			const rightRow = rowTwoStart
			if (rightRow >= 0 && rightRow < secondSection.seats.length) {
				const rightSeat = secondSection.seats[rightRow][secondSectionFirstCol]
				currentSeat.constraints[ConstraintLevel.Low].push(
					new Constraint(secondSection.id, rightRow, secondSectionFirstCol)
				)
				rightSeat.constraints[ConstraintLevel.Low].push(
					new Constraint(firstSection.id, row, firstSectionLastCol)
				)
			}

			//2-bottom right
			const bottomRightRow = rowTwoStart + 1
			if (bottomRightRow >= 0 && bottomRightRow < secondSection.seats.length) {
				const bottomRightSeat = secondSection.seats[bottomRightRow][secondSectionFirstCol]
				currentSeat.constraints[ConstraintLevel.Strict].push(
					new Constraint(secondSection.id, bottomRightRow, secondSectionFirstCol)
				)
				bottomRightSeat.constraints[ConstraintLevel.Strict].push(
					new Constraint(firstSection.id, row, firstSectionLastCol)
				)
			}
		}
	}

	static dropConstraints(section, hall) {
		for (let i = 0; i < section.seats.length; i++) {
			for (let j = 0; j < section.seats[i].length; j++) {
				const seat = section.seats[i][j]
				//Todo:
			}
		}
	}

	static resize(rows, cols, section, hall) {}

	static generateSeats(rows, cols, sectionId) {
		let seats = new Array(rows).fill(null).map((_, rowIdx) => {
			return new Array(cols).fill(null).map((_, colIdx) => {
				return new Seat(new SeatPosition(rowIdx, colIdx), sectionId)
			})
		})
		return seats
	}

	reload(data) {}
}

export class Hall {
	constructor(name) {
		this.name = name ?? `noname-${Math.floor(Math.random() * 1000)}`
		this.id = null
		this.capacity = 0
		this.size = { width: 430, height: 550 }
		this.paper = { x: 0, y: 0 }
		this.sections = []
		this.invigilatorSpots = []
	}

	addSection(rowLength, colLength) {
		this.sections.push(new Section(rowLength, colLength))
	}
	reload(data) {}
}
