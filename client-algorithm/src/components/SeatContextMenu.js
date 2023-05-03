const SeatContextMenu = ({ seat }) => {
	return (
		<div>
			<div className="text-sm divide-y-2 divide-gray-400 py-2 px-1 [&>*]:py-1">
				<div>
					<span className="font-semibold">Section ID:</span> {seat.sectionId}
				</div>
				<div>
					<span className="font-semibold">Geometric Position: </span>
					<span className="font-semibold">col: </span>
					{seat.position.col}
					<span className="font-semibold"> row: </span>
					{seat.position.row}
				</div>
			</div>
		</div>
	)
}

export default SeatContextMenu
