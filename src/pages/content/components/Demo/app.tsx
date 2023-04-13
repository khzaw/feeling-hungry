import { useEffect } from "react";
import CartOrder from "@src/pages/content/components/Demo/cartorder";

export default function App() {
	useEffect(() => {
		console.log("content view loaded");
	}, []);

	return (
		<CartOrder />
	);
}
