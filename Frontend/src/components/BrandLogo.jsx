import { Link } from "react-router-dom";

function BrandLogo({ to, className, onClick }) {
  return (
    <Link to={to} className={className} onClick={onClick}>
      <img src="/mockmind-logo.svg" alt="MockMind" />
    </Link>
  );
}

export default BrandLogo;
