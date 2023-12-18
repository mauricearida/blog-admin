import { NavLink } from "react-router-dom";
import { AiFillFileAdd, AiOutlineHome } from "react-icons/ai";

import logo from "./logo.svg";

const NavItem = ({ to, value, closed, icon }) => {
  const commonClasses = "flex items-center space-x-2 w-full p-2 block whitespace-nowrap";
  const activeClass = commonClasses + " bg-blue-500 text-white";
  const inActiveClass = commonClasses + " text-gray-500";

  return (
    <NavLink className={({ isActive }) => (isActive ? activeClass : inActiveClass)} to={to}>
      {icon}
      <span className={`w-${closed ? "0" : "full"} transition-width overflow-hidden`}>{value}</span>
    </NavLink>
  );
};

export default function Navbar({ closed }) {
  return (
    <nav>
      <div className="flex justify-center p-3">
        <img className="w-14" src={logo} alt="Logo" />
      </div>
      <ul>
        <li>
          <NavItem closed={closed} to="/" value="Home" icon={<AiOutlineHome size={24} />} />
        </li>
        <li>
          <NavItem
            closed={closed}
            to="/create-post"
            value="Create Post"
            icon={<AiFillFileAdd size={24} />}
          />
        </li>
      </ul>
    </nav>
  );
}
