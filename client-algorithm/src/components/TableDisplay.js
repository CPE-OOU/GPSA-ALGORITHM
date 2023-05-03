function TableDisplay({ labels, rows, formatRow, onDelete, onNew, sizing, addNew, onRowClick }) {
	return (
		<div>
			<div className="overflow-auto scrollbar-hidden pb-20">
				<table className="w-full table">
					<thead className="bg-white font-inter">
						<tr className="text-[#757575] [*&>th]:text-[13px] [*&>th]:bg-white [*&>th]:border-b [*&>th]:py-4 font-[500] [*&>th]:normal-case">
							<th
								style={{
									borderRadius: 0,
									position: "initial",
								}}
							>
								ID
							</th>
							{labels.map((label, idx) => (
								<th
									key={idx}
									style={{
										borderRadius: 0,
										position: "initial",
									}}
								>
									{label}
								</th>
							))}
							<th className="sticky right-0 text-center shadow-sm">
								<button
									onClick={() => {
										onNew()
									}}
									className="bg-primary px-3 py-2 rounded-full text-white font-medium"
								>
									{addNew}
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, idx) => (
							<TableRow
								key={idx}
								onRowClick={onRowClick}
								row={row}
								index={idx + 1}
								formatRow={formatRow}
								onDelete={onDelete}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function TableRow({ row, index, formatRow, onDelete, onRowClick }) {
	return (
		<tr
			onClick={() => {
				onRowClick instanceof Function && onRowClick(row)
			}}
			className="font-ptsans font-medium text-black"
		>
			<td>{index}</td>
			{formatRow(row).map((fRow, idx) => (
				<td key={idx}>{fRow}</td>
			))}
			<td className="sticky right-0 text-center block  text-[#ff0606]">
				<button
					onClick={(e) => {
						e.stopPropagation()
						onDelete(row)
					}}
				>
					Remove
				</button>
			</td>
		</tr>
	)
}

export default TableDisplay
