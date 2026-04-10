import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useDispatch } from 'react-redux'

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getuser`, { withCredentials: true })
        if (result.data) {
          dispatch(setUserData(result.data));
        }
      } catch (error) {
        console.log("Not logged in or error:", error)
      }
    }
    getUser();
  }, [dispatch])
}

export default useGetCurrentUser;