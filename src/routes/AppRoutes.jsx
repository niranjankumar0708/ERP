import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Pages import
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Sales from '../pages/Sales';
import HR from '../pages/HR';
import CRM from '../pages/CRM';
import Finance from '../pages/Finance';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales" element={<Sales />} />
        <Route path="hr" element={<HR />} />
        <Route path="crm" element={<CRM />} />
        <Route path="finance" element={<Finance />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
