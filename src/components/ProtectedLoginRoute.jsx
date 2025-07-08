import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedLoginRoute({ children }) {
  const name = useSelector((state) => state.user.name);
  if (name) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default ProtectedLoginRoute;