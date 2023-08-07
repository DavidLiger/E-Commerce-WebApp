import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector} from "react-redux"
import { getUser } from './features/userSlice';
import { getDevices } from './features/devicesSlice';
import { getBrands } from './features/brandsSlice';
import { getAgencies } from './features/agenciesSlice';
import { setRepairFileFromLocalStorage } from './features/repairFileSlice';
import { useMemo } from 'react';


// pages & components
import Home from './pages/Home'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyAccount from './pages/auth/VerifyAccount';
import ForgotPassword from './pages/auth/ForgotPassword';
import RepairFile from './pages/RepairFile';
import About from './pages/About';
import Account from './pages/Account';
import Services from './pages/Services';
import Products from './pages/Products';
import Blog from './pages/Blog';
import Careers from './pages/Carrers';
import Contact from './pages/Contact';
import Legal from './pages/legals/Legal';
import RGPD from './pages/legals/RGPD';
import Profile from './pages/Profile';
import CGV from './pages/legals/CGV';
import Agencies from './pages/Agencies';
import Trades from './pages/Trades';
import Admin from './pages/Admin';
import Articles from './pages/Articles';
import AdminFiles from './pages/adminViews/AdminFiles';
import AdminDates from './pages/adminViews/AdminDates';
import FAQ from './pages/FAQ';
import { setPathFromLocalStorage } from './features/pathSlice';
import { setPhotosFromLocalStorage } from './features/photosSlice';
import { getArticles } from './features/articlesSlice';

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.user)
  const { path } = useSelector((store) => store.path)
  const repairFile = JSON.parse(localStorage.getItem('repairFile'))
  const pathFromLocalStorage = JSON.parse(localStorage.getItem('path'))
  const photos = JSON.parse(localStorage.getItem('photos'))
  // useMemo : trigger function before rendering instead of useeffect that do the inverse
  useMemo(() => {
      dispatch(getUser())
      dispatch(getDevices())
      dispatch(getBrands())
      dispatch(getAgencies())
      dispatch(getArticles())
      if(repairFile){
        dispatch(setRepairFileFromLocalStorage(repairFile))
      }
      if(pathFromLocalStorage){
        dispatch(setPathFromLocalStorage(pathFromLocalStorage))
      }
      if(photos){
        dispatch(setPhotosFromLocalStorage(photos))
      }
      // eslint-disable-next-line
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Sidebar/>
        <div className='pages'>
          <Routes>
            <Route
              path='/'
              element={<Home/>}
            />
            <Route
              path='/login'
              element={!user ? <Login/> : <Navigate to={path.path}/>}
            />
            <Route
              path='/signup'
              element={!user ? <Signup/> : <Navigate to="/"/>}
            />
            <Route
              path='/verify-account'
              element={<VerifyAccount/>}
            />
            <Route
              path='/forgot-password'
              element={<ForgotPassword/>}
            />
            <Route
              path='/account'
              element={user ? <Account/> : <Login/>}
            />
            <Route
              path='/rendez-vous'
              element={<RepairFile/>}
            />
            <Route
              path='/about'
              element={<About/>}
            />
            <Route
              path='/services'
              element={<Services/>}
            />
            <Route
              path='/agencies'
              element={<Agencies/>}
            />
            <Route
              path='/trades'
              element={<Trades/>}
            />
            <Route
              path='/products'
              element={<Products/>}
            />
            <Route
              path='/blog'
              element={<Blog/>}
            />
            <Route
              path='/careers'
              element={<Careers/>}
            />
            <Route
              path='/contact'
              element={<Contact/>}
            />
            <Route
              path='/legal'
              element={<Legal/>}
            />
            <Route
              path='/rgpd'
              element={<RGPD/>}
            />
            <Route
              path='/profile'
              element={<Profile/>}
            />
            <Route
              path='/cgv'
              element={<CGV/>}
            />
            <Route
              path='/admin'
              element={user && user.user.role == 'admin' ? <Admin/> : <Navigate to="/"/>}
            />
            <Route
              path='/admin-files'
              element={user && user.user.role == 'admin' ? <AdminFiles/> : <Navigate to="/"/>}
            />
            <Route
              path='/admin-dates'
              element={user && user.user.role == 'admin' ? <AdminDates/> : <Navigate to="/"/>}
            />
            <Route
              path='/faq'
              element={<FAQ/>}
            />
            <Route
              path='/articles'
              element={<Articles/>}
            />
          </Routes>
        </div>
        <Footer/>
      </BrowserRouter>  
    </div>
  );
}

export default App;
