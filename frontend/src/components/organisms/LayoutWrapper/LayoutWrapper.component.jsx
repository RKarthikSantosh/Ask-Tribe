

import SideBar from './SideBar/SideBar.component';
import RightSideBar from './RightSideBar/RightSideBar.component';
import Footer from "../Footer/Footer.component";

const LayoutWrapper = ({ children }) => {
  return (
    <>
      <div className='page'>
        <SideBar />
        <div id='content'>
          {children}
          <RightSideBar />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default LayoutWrapper;
