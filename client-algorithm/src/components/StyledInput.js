const StyledInput = ({ type, ...otherProps }) => {
	return (
		<input
			type={type ? type : "number"}
			className="text-sm w-[60px] px-[1px] py-[1px] h-6 border border-gray-400 rounded-sm"
			{...otherProps}
		/>
	)
}

export default StyledInput
