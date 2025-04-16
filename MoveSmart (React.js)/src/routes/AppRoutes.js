import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../layouts/sharedLayouts';
import Login from '../pages/Login';
import Requests from '../pages/Requests';


import Home from '../pages/Home';


export default function AppRoutes() {
  return (
    <Routes>
      
      
        <Route path='/' element={<Login />} />

      
      <Route element={<SharedLayout />}>
        <Route path='/home' element={<Home />} />
        <Route path='/requests' element={<Requests />} />
       
      </Route>
    </Routes>
  );
}
