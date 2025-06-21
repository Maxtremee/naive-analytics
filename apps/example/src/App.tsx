import { useState } from "react";

export default function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>Count is: {count}</div>
			<div>
				<button onClick={() => setCount(count + 1)} type="button">
					Increment
				</button>
				<button onClick={() => setCount(count - 1)} type="button">
					Decrement
				</button>
			</div>
			<a href="https://example.com" target="_blank" rel="noopener">
				Link
			</a>
			<a href="#test">
				Link
			</a>
		</>
	);
}
