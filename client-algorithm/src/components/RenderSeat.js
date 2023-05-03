import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone"

const RenderSeats = ({ hall, colors, onClick }) => {
	const generateSeats = (hall, colors, onClick) => {
		let columns = Array.from({ length: hall.rowLength / 3 }, () => {
			return []
		})
		let i = 0
		while (i < hall.seats.length) {
			for (let k = 0; k < columns.length; k++) {
				for (let l = 0; l < 3 && i < hall.seats.length; l++, i++) {
					const idx = i
					columns[k].push(
						<div
							onClick={() => {
								onClick && onClick(hall.seats[idx])
							}}
							key={idx}
							style={{
								backgroundColor: hall.seats[idx].course
									? colors[hall.seats[idx].course]
									: colors["None"],
							}}
							className={`aspect-[2/1]  flex items-center justify-center rounded-sm cursor-pointer`}
						>
							{!hall.seats[i].inGoodCondition && (
								<CloseTwoToneIcon className="w-full h-full text-red-600"></CloseTwoToneIcon>
							)}
						</div>
					)
				}
			}
		}
		return columns
	}
	return (
		<div className="gap-2 flex items-start">
			{generateSeats(hall, colors, onClick).map((column, idx) => {
				return (
					<div
						key={idx}
						className="flex-1 gap-[1px]"
						style={{
							display: "grid",
							gridTemplateColumns: `repeat(${3}, 3rem`,
						}}
					>
						{column}
					</div>
				)
			})}
		</div>
	)
}

export default RenderSeats
