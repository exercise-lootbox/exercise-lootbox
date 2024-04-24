import { Link, useLocation } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GiChest } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import "./NavBar.css";
import { showAdminContent } from "../../utils";

function NavBar({ closeAction }: { closeAction: (() => void) | undefined }) {
  const { pathname } = useLocation();
  const adminId = useSelector((state: any) => state.persistedReducer.adminId);
  const actingAsAdmin = useSelector((state: any) => state.persistedReducer.actingAsAdmin);
  const adminActive = showAdminContent(adminId, actingAsAdmin);

  const fitcoinLinks = [
    {
      label: adminActive ? "Admin Home" : "Home",
      basePath: "home",
      icon: <FaHome className="fs-3" />,
      display: true,
    },
    {
      label: adminActive ? "User Search" : "Activities",
      basePath: "search",
      icon: <FaMagnifyingGlass className="fs-3" />,
      display: true,
    },
    {
      label: adminActive ? "Edit Shop" : "Shop",
      basePath: "shop",
      icon: <FaShoppingCart className="fs-3" />,
      display: true,
    },
    {
      label: adminActive ? "Admin Profile" : "Profile",
      basePath: "profile",
      icon: <FaUser className="fs-3" />,
      display: true,
    },
    {
      label: "Inventory",
      basePath: "inventory",
      icon: <GiChest className="fs-3" />,
      display: !adminActive,
    },
  ];

  return (
    <ul className="navigation">
      {closeAction && (
        <div className="">
          <button className="icon-button-accent" onClick={closeAction}>
            <IoMdClose className="fs-2 ms-1" />
          </button>
        </div>
      )}
      {fitcoinLinks.filter((link) => link.display).map((link, index) => (
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
