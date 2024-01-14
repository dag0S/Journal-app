import './CardButton.css';

const CardButton = ({ children, className, ...props }) => {
  const cl = 'card-button' + (className ? ' ' + className : '');

  return (
    <button {...props} className={cl}>
      {children}
    </button>
  );
};

export default CardButton;
