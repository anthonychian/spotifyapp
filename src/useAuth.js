import { useEffect, useState } from "react";
import axios from 'axios';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const baseURL = (process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : 'http://localhost:8000');


  useEffect(() => {
    axios
      .post(`${baseURL}/login`, { code })
      .then((response) => {
        // If success then cut the code string from the URL and execute the other thing
        window.history.pushState({}, null, "/");

        setAccessToken(response.data.accessToken);

      })
      .catch(() => {
        //   If fail redirect to home page - Login page
        window.location = "/";
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return accessToken
}
