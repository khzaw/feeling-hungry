import { useEffect } from 'react';

export default function CartOrder() {
	useEffect(() => {

		console.log('CartOrder');

		const handleMessage = (
			message: any,
			sender: chrome.runtime.MessageSender,
			senderResponse: (response?: any) => void
		) => {
			console.log('Message received in content script:', message, sender, senderResponse);
		}
		chrome.runtime.onMessage.addListener(handleMessage);

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		}

	}, []);

	return null;
}
