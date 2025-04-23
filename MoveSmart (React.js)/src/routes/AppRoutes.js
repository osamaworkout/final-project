import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../layouts/sharedLayouts';
import Login from '../pages/Login';
import Requests from '../pages/Requests';
import Home from '../pages/Home';
import CarsPage from '../pages/carList';
import Consumables from '../pages/consumables'
import Subscription from '../pages/Subscription'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={<SharedLayout />}>
        <Route path='/home' element={<Home />} />
        <Route path='/carList' element={<CarsPage />} />
        <Route path='/requests' element={<Requests />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='/consumables' element={<Consumables />} />
      </Route>
    </Routes>
  );
}