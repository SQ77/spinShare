import React from 'react';

const ChatButton = ({ onClick }) => {
  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
    >
      💬
    </div>
  );
};

export default ChatButton;
