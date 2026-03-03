

const BaseButton = ({text, selected, onClick}) => {
  return (
    <>
      <button
        className={`s-btn s-btn__filled ${
          selected === text ? 'is-selected' : ''
        }`}
        style={{margin: '0'}}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default BaseButton;
