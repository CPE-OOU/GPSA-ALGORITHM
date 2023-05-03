import { useSelectMode } from "../hooks/useSelectMode"
const MovableWrapper = ({ children, position, rotation, onMouseDown }) => {
	let selectMode = null
	try {
		const s = useSelectMode()
		selectMode = s
	} catch (error) {}

	if (selectMode && selectMode.active) {
		return (
			<div
				style={{
					top: `${position.y}px`,
					left: `${position.x}px`,
					transform: `rotate(${rotation ?? 0}deg)`,
					transformOrigin: "0 0",
				}}
				className="absolute border-2 border-transparent p-[3px]"
			>
				{children}
			</div>
		)
	}

	return (
		<div
			style={{
				top: `${position.y}px`,
				left: `${position.x}px`,
				transform: `rotate(${rotation ?? 0}deg)`,
				transformOrigin: "0 0",
			}}
			className="absolute border-2 border-transparent hover:border-dashed hover:border-[#3182d9] p-[3px]"
		>
			{children}

			{/* Left */}
			<span
				onMouseDown={(e) => {
					onMouseDown && onMouseDown(e)
				}}
				onTouchStart={(e) => {
					e.clientX = e.touches[0].clientX
					e.clientY = e.touches[0].clientY
					onMouseDown && onMouseDown(e)
				}}
				className="absolute  -left-[2px] -top-[2px] h-[calc(100%+4px)] w-[2px] peer hover:cursor-move"
			></span>

			{/* Right */}
			<span
				onMouseDown={(e) => {
					onMouseDown && onMouseDown(e)
				}}
				onTouchStart={(e) => {
					e.clientX = e.touches[0].clientX
					e.clientY = e.touches[0].clientY
					onMouseDown && onMouseDown(e)
				}}
				className="absolute  -right-[2px] -top-[2px] h-[calc(100%+4px)] w-[2px] peer hover:cursor-move"
			></span>

			{/* top */}
			<span
				onMouseDown={(e) => {
					onMouseDown && onMouseDown(e)
				}}
				onTouchStart={(e) => {
					e.clientX = e.touches[0].clientX
					e.clientY = e.touches[0].clientY
					onMouseDown && onMouseDown(e)
				}}
				className="absolute  -left-[2px] -top-[2px] w-[calc(100%+4px)] h-[2px] peer hover:cursor-move"
			></span>

			{/* bottom */}
			<span
				onMouseDown={(e) => {
					onMouseDown && onMouseDown(e)
				}}
				onTouchStart={(e) => {
					e.clientX = e.touches[0].clientX
					e.clientY = e.touches[0].clientY
					onMouseDown && onMouseDown(e)
				}}
				className="absolute  -left-[2px] -bottom-[2px] w-[calc(100%+4px)] h-[2px] peer hover:cursor-move"
			></span>

			{/* border */}
			<span
				className="absolute -z-10 -top-[2px] -left-[2px] h-[calc(100%+4px)]  w-[calc(100%+4px)] 
			border-2 border-transparent peer-hover:border-[#3182d9]"
			></span>
		</div>
	)
}

export default MovableWrapper
