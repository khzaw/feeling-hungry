import { useEffect } from 'react';

export default function CartOrder() {
	useEffect(() => {

		console.log('CartOrder');

		const handleMessage =  (
			message: any,
			sender: chrome.runtime.MessageSender,
			sendResponse: (response?: any) => void
		) => {
			console.log('Message received in content script:', message, sender, sendResponse);
			if(message !== null) {
				localStorage.setItem('cart', JSON.stringify(message));
				sendResponse({ storageSuccess: true });
			}
		}
		chrome.runtime.onMessage.addListener(handleMessage);

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		}

	}, []);

	return null;
}
