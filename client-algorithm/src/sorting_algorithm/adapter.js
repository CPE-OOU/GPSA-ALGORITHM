import Hall from "./Hall"

export const halls = [
	{ name: "computer", capacity: 90, rowLength: 6 },
	{ name: "elect", capacity: 180, rowLength: 9 },
	{ name: "mech", capacity: 180, rowLength: 9 },
	{ name: "agric", capacity: 180, rowLength: 9 },
	{ name: "civil", capacity: 180, rowLength: 9 },
	{ name: "architecture", capacity: 180, rowLength: 9 },
]

export { Hall }

/* 
        **** startArrangement function ****
     Parameters
    - halls should be an array of selected halls
    - data should be an array / json from  CSV file convertion to json
    - sortingType indicates the type of arrangement, it can only be "low","medium","strict" (strict coming soon)

    Return Value
    - it returns a json of sorted arrangements across the halls that will be converted back to a CSV file

    Throws an error if there is not enough seats to arrange the students

    You can find sample output in the console
    */

export const startArrangement = (halls, studentsCsv, arrangementType) => {
	let students = [...studentsCsv]

    let groupedStudents = {}

    for (const student of students) {
        if (groupedStudents[student.course]) {
            groupedStudents[student.course].push(student)
        } else {
            groupedStudents[student.course] = []
            groupedStudents[student.course].push(student)
        }
    }

	let i = 0
	let arrangedStudents = []

	while (i < halls.length && students.length > 0) {
		halls[i].assignSeats(students, arrangementType)
		students = halls[i].unplacedStudents
		arrangedStudents = [...arrangedStudents, ...halls[i].sortedArrangements()]
		i++
	}

	if (students.length > 0) {
		throw new Error(
			`There are/is ${students.length} student(s) left to be placed, lower sorting type or select more halls`
		)
	} else {
		return arrangedStudents
	}
}
