import { Outlet } from "react-router-dom";
import  Sidebar from '../Components/Sidebar'

const Layout = ({ hideSidebar }) => {
  return (
    <div className="flex min-h-screen bg-black">
      {!hideSidebar && <Sidebar />}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-[250px] lg:ml-[250px] md:ml-[80px] p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
