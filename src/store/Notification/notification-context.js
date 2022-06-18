import React, { useState } from 'react';
import NotificationModal from '../../components/UI/NotificationModal';

// interface NotificationModalContextObj {
// 	dismissModal: () => void;
// 	showModal: (message: string) => void;
// }

export const NotificationModalContext = React.createContext({
	dismissModal: () => {},
	showModal: (message) => {},
});

const NotificationModalProvider = (props) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	let [message, setMessage] = useState(null);

	const dismissModal = () => {
		setIsModalVisible(false);
	};

	const showModal = (message) => {
		setMessage(message);
		setIsModalVisible(true);
	};

	const contextValue = {
		dismissModal,
		showModal,
	};

	return (
		<NotificationModalContext.Provider value={contextValue}>
			{isModalVisible ? <NotificationModal message={message} onClick={dismissModal}></NotificationModal> : <></>}
			{props.children}
		</NotificationModalContext.Provider>
	);
};

export default NotificationModalProvider;