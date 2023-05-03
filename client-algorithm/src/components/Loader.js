import ClipLoader from "react-spinners/BeatLoader"
import { Modal } from "@mui/material"

function Loader({ open: loading }) {
	return (
		<Modal
			open={loading}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div className="focus:outline-none outline-none">
				<ClipLoader loading={loading}></ClipLoader>
			</div>
		</Modal>
	)
}

export default Loader
