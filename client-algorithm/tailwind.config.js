// /** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx,html,css,scss}",
		"node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		colors: {
			primary: "#3a55a3",
			primarydark: "#0c2876",
		},
		fontFamily: {
			inter: "inter",
			ptsans: "PT Sans",
		},
	},
	plugins: [require("flowbite/plugin"), require("daisyui")],
}
