import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { useQuery } from '@apollo/client';
import { spacexQ } from './queries';

const App = () => {
  const { loading, error, data } = useQuery(spacexQ);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
    <div>
      <p>Type: {data.company.__typename}</p>
      <p>CEO: {data.company.ceo}</p>
    </div>
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
    </div>
  );
};

export default App;
