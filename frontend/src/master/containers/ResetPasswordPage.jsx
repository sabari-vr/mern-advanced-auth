import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import { useAuth } from "../hooks";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("")
	const { resetPasswordMutation } = useAuth()

	const { token } = useParams();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			return setError("Passwords do not match");
		}
		try {
			resetPasswordMutation.mutate({ token, password });
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!!error) {
			if (password === confirmPassword) {
				return setError("");
			}
		}

	}, [password, confirmPassword])

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Reset Password
				</h2>
				{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
				{/* {message && <p className='text-green-500 text-sm mb-4'>{message}</p>} */}

				<form onSubmit={handleSubmit}>
					<Input
						icon={Lock}
						type='password'
						placeholder='New Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm New Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					<PasswordStrengthMeter password={password} />


					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={resetPasswordMutation.isPending}
					>
						{resetPasswordMutation.isPending ? "Resetting..." : "Set New Password"}
					</motion.button>
				</form>
			</div>
		</motion.div>
	);
};
export default ResetPasswordPage;
