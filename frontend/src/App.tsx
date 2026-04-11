
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './page/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import UserDashBoard from './page/UserDashBoard'
import useGetApplications from './hooks/useGetApplications'

export const serverUrl ="https://aijobtrack-6.onrender.com"

function App() {

useGetCurrentUser()
useGetApplications()
  return (
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/dashboard' element={<UserDashBoard/>} />
   </Routes>
  )
}

export default App
