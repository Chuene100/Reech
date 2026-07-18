import React from "react";
import { useSelector } from "react-redux";

const useIsAuthenticated = () => {
  const userTokens = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    setIsAuthenticated(
      userTokens?.access_token && userTokens?.refresh_token && !isAuthenticated
    );
  }, [userTokens]);

  return isAuthenticated;
};

export default useIsAuthenticated;
