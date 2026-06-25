import { Outlet } from "react-router";

export function Root() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1680449786212-de3b835dc467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-blue-900/80 to-gray-900/90"></div>
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
