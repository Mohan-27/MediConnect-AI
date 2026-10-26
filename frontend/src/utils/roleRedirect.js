const getDashboardPath = (role) => {
  const dashboardPaths = {
    patient: "/patient/dashboard",
    doctor: "/doctor/dashboard",
    hospital: "/hospital/dashboard",
    laboratory: "/laboratory/dashboard",
    pharmacy: "/pharmacy/dashboard",
    globalAdmin: "/admin/dashboard",
  };

  return dashboardPaths[role] || "/dashboard";
};

export default getDashboardPath;