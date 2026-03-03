
import {Link} from 'react-router-dom';

const LinkButton = ({text, link, type, handleClick, marginTop}) => {
  return (
    <>
      <Link onClick={handleClick} to={link}>
        <button className={`s-btn ${type}`} style={{marginTop}}>
          {text}
        </button>
      </Link>
    </>
  );
};

export default LinkButton;
