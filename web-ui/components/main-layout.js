import Footer from "./footer";

const { default: NavigationBar } = require("./navigation-bar");

const MainLayout = ({ children }) => {
  return (
    <div className="bg-black text-white min-h-screen">
      <NavigationBar />
      <div className="container mx-auto py-16">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
