import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setApplications, setError, setLoading } from "../redux/applicationSlice";
import { serverUrl } from "../App";

const useGetApplications = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        dispatch(setLoading(true));

        const res = await axios.get(`${serverUrl}/api/application/getApplication`, {
          withCredentials: true,
        });

        dispatch(setApplications(res.data));
        dispatch(setError(null));

      } catch (err: any) {
        dispatch(setError(err.response?.data?.message || "Fetch failed"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchApplications();
  }, [dispatch]);

};

export default useGetApplications;