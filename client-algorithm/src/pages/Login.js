import React from "react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import useAuth from "../hooks/useAuth"
import { useFormik } from "formik"
import * as yup from "yup"
import OOUlogo from "./oou.png"
export default function Login() {
	const { login } = useAuth()
	const Schema = yup.object().shape({
		email: yup.string().required("Email is required"),
		password: yup.string().required("Password is required"),
	})

	const form = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values) => {
			try {
				await login(values.email, values.password)
			} catch (error) {
				toast.error(error?.message)
			}
		},
		validationSchema: Schema,
	})

	return (
		<div className="grid">
			<div className="grid h-screen content-center gap-2 md:content-around">
				<div className="mx-auto w-11/12 px-4 xs:w-10/12 sm:px-6 md:w-7/12 md:pb-24 lg:w-5/12">
					<div className="flex justify-center mb-10 items-center gap-x-2">
						<img src={OOUlogo} alt="oou logo" className="w-20 h-20" />{" "}
						<span className="text-4xl font-bold text-[#757575]">Login</span>
					</div>
					<form className="max-w- mx-auto mt-4 mb-0 space-y-4" onSubmit={form.handleSubmit}>
						<div className="relative">
							<input
								type="text"
								id="email"
								className="peer block w-full appearance-none rounded-lg border-2 border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 font-mulish text-md font-medium text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
								placeholder="Email Address"
								value={form.values.email}
								name="email"
								onChange={form.handleChange}
								onBlur={form.handleBlur}
								style={{
									border: form.touched.email && form.errors.email ? "2px solid #f87171" : "",
								}}
							/>

							{form.touched.email && form.errors.email ? (
								<small className="text-red-500 font-semibold font-mulish text-xs">
									{form.errors.email}
								</small>
							) : null}
						</div>

						{/* Password */}
						<div className="relative ">
							<input
								type="password"
								id="password"
								className="peer block w-full appearance-none rounded-lg border-2 border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 font-mulish text-md font-medium text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
								placeholder="Password"
								value={form.values.password}
								name="password"
								onChange={form.handleChange}
								onBlur={form.handleBlur}
								style={{
									border: form.touched.password && form.errors.password ? "2px solid #f87171" : "",
								}}
							/>

							{form.touched.password && form.errors.password ? (
								<small className="text-red-500 font-semibold font-mulish text-xs">
									{form.errors.password}
								</small>
							) : null}
						</div>
						<div className="flex items-center justify-between">
							<Link className="font-mulish text-sm font-bold text-gray-300 hover:underline ">
								Forgot password?
							</Link>
						</div>

						{form.isSubmitting ? (
							<>
								<button
									type="submit"
									className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold leading-6 text-primarydark transition duration-150 ease-in-out border-2 border-primarydark rounded-md shadow"
									disabled
								>
									<svg
										className="w-5 h-5 mr-3 -ml-1 text-primarydark animate-spin"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Loading...
								</button>
							</>
						) : (
							<>
								<button
									type="submit"
									className="inline-block  w-full text-center items-center py-2  font-semibold leading-6 text-white transition duration-150 ease-in-out border-2 bg-primarydark  rounded-md shadow"
								>
									Login
								</button>
							</>
						)}
					</form>
				</div>
			</div>
		</div>
	)
}
