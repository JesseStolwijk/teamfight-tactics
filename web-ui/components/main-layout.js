import Footer from "./footer";

const { default: NavigationBar } = require("./navigation-bar");

const MainLayout = ({ children }) => {
  return (
    <div className="bg-black text-white  min-h-screen">
      <NavigationBar />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
