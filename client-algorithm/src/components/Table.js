const Table = ({ headers, rows, transform, onRowClick }) => {
	return (
		<div>
			<table className="w-full text-sm md:text-md">
				<colgroup>
					{headers.map((header, idx) => {
						return <col key={idx} width={`${header.width}`} />
					})}
				</colgroup>
				<thead>
					<tr className="text-left">
						{headers.map((header, idx) => {
							return (
								<th
									key={idx}
									className={`py-1 px-2 truncate max-w-[1px] font-medium bg-black text-white ${
										idx === 0 ? "rounded-tl-lg" : idx === headers.length - 1 ? "rounded-tr-lg" : ""
									} ${header.hide && "hidden md:table-cell"}`}
								>
									{header.title}
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody className="mt-1">
					{rows.map((file, idx) => (
						<TableRow
							key={idx}
							onRowClick={onRowClick}
							row={transform(file)}
							fullData={file}
							number={idx + 1}
						/>
					))}
				</tbody>
			</table>
			{rows.length === 0 && (
				<p className="font-semibold text-2xl text-center text-black/40 py-4">No rows to render</p>
			)}
		</div>
	)
}
const TableRow = ({ number, row, fullData, onRowClick }) => {
	return (
		<tr
			onClick={(e) => {
				onRowClick && onRowClick(fullData)
			}}
			tabIndex={1}
			className={` focus:ring-2 focus:ring-black hover:ring-2 hover:ring-black cursor-pointer ${
				number % 2 === 0 && "bg-black/10"
			}`}
		>
			<td className="py-3 px-2 truncate max-w-[1px]">{number}</td>
			{row.map((column, idx) => {
				return (
					<td key={idx} className="py-3 px-2 truncate max-w-[1px]">
						{String(column)}
					</td>
				)
			})}
		</tr>
	)
}

export default Table
