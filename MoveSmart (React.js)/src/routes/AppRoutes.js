import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../layouts/sharedLayouts';
import Login from '../pages/Login';
import Requests from '../pages/Requests';
import Role0 from '../pages/Roles/role0';
import Role1 from '../pages/Roles/role1';
import Role2 from '../pages/Roles/role2';
import Role3 from '../pages/Roles/role3';
import Role4 from '../pages/Roles/role4';
import Role5 from '../pages/Roles/role5';
import CarsPage from '../pages/carList';
import Drivers from '../pages/driver'
import Consumables from '../pages/consumables'
import SpareParts from '../pages/spareParts'
import Subscription from '../pages/Subscription'
import PatrolsList from '../pages/patrolsList'
// import Subdetail from '../pages/subscribeDetail'
// import Patroldetail from '../pages/patrolDetails'
// import Cardetail from '../pages/carDetails'
// import Driverdetail from '../pages/driverDetails'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={<SharedLayout />}>
        <Route path='/role0' element={<Role0 />} />
        <Route path='/carList' element={<CarsPage />} />
        <Route path='/drivers' element={<Drivers />} />
        <Route path='/requests' element={<Requests />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='/patrolsList' element={<PatrolsList />} />
        <Route path='/consumables' element={<Consumables />} />
        <Route path='/spareParts' element={<SpareParts />} />
        {/* <Route path='/sub-detail' element={<Subdetail />} />
        <Route path='/cardetail' element={<Cardetail />} />
        <Route path='/driverdetail' element={<Driverdetail />} />
        <Route path='/patroldetail' element={<Patroldetail />} /> */}
      </Route>
    </Routes>
  );
}