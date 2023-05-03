import { useContext } from "react"
import { SelectModeContext } from "../context/SelectContext"

export function useSelectMode() {
	return useContext(SelectModeContext)
}
