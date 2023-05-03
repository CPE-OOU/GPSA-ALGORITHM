import { Position } from "../sorting_algorithm/classes"

const ResizeWrapper = ({ children, setResizeEntry }) => {
	return (
		<div className="relative">
			{/* Left  */}
			<span
				onMouseDown={(e) => {
					setResizeEntry({
						...new Position(e.clientX, e.clientY),
						position: "x",
						updateSection: true,
					})
				}}
				className="absolute  -left-[4px] top-0 h-full w-[2px] hover:bg-[#3182d9] hover:cursor-e-resize"
			></span>

			{/* Right  */}
			<span
				onMouseDown={(e) => {
					setResizeEntry({
						...new Position(e.clientX, e.clientY),
						position: "x",
						updateSection: false,
					})
				}}
				className="absolute -right-[4px] top-0 h-full w-[2px] hover:bg-[#3182d9] hover:cursor-e-resize"
			></span>
			{/* Bottom */}
			<span
				onMouseDown={(e) => {
					setResizeEntry({
						...new Position(e.clientX, e.clientY),
						position: "y",
						updateSection: false,
					})
				}}
				className="absolute -bottom-[4px] left-0 w-full h-[2px] hover:bg-[#3182d9] hover:cursor-n-resize"
			></span>

			{/* Top */}
			<span
				onMouseDown={(e) => {
					setResizeEntry({
						...new Position(e.clientX, e.clientY),
						position: "y",
						updateSection: true,
					})
				}}
				className="absolute -top-[4px] left-0 w-full h-[2px] hover:bg-[#3182d9] hover:cursor-n-resize"
			></span>
			{children}
		</div>
	)
}

export default ResizeWrapper
