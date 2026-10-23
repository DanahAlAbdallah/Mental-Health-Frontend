import { useAuth } from "../../context/AuthContext";

// Overview.tsx
function Overview() {
  const { user } = useAuth();
  return (
    <h1 className="text-2xl font-semibold text-heading">
      Welcome, {user?.name}
    </h1>
  );
}
export default Overview;
