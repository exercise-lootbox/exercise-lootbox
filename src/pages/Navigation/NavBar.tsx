import { Link, useLocation } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GiChest } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import "./NavBar.css";

const fitcoinLinks = [
  { label: "Home", basePath: "home", icon: <FaHome className="fs-3" /> },
  {
    label: "Activities",
    basePath: "search",
    icon: <FaMagnifyingGlass className="fs-3" />,
  },
  {
    label: "Shop",
    basePath: "shop",
    icon: <FaShoppingCart className="fs-3" />,
  },
  { label: "Profile", basePath: "profile", icon: <FaUser className="fs-3" /> },
  {
    label: "Inventory",
    basePath: "inventory",
    icon: <GiChest className="fs-3" />,
  },
];

function NavBar({ closeAction }: { closeAction: (() => void) | undefined }) {
  const { pathname } = useLocation();

  return (
    <ul className="navigation">
      {closeAction && (
        <div className="">
          <button className="icon-button-accent" onClick={closeAction}>
            <IoMdClose className="fs-2 ms-1" />
          </button>
        </div>
      )}
      {fitcoinLinks.map((link, index) => (
        <li
          key={index}
          className={pathname.includes(link.basePath) ||
            (pathname.includes("details") && link.basePath.includes("search")) ? "nav-active" : ""}
        >
          <Link className="text-decoration-none" to={`/${link.basePath}`}>
            <div className="navigation-pill">
              <div className="navigation-icon">{link.icon}</div>
              <div className="navigation-nav-label">{link.label}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavBar;
