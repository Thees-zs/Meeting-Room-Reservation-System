import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, Home, Bookmark, Settings, LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  // Check login status
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">会议室管理系统</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/app"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/app') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                <span>首页</span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/rooms"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/app/rooms') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <Calendar className="w-5 h-5 mr-3" />
                <span>会议室列表</span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/my-bookings"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/app/my-bookings') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <Bookmark className="w-5 h-5 mr-3" />
                <span>我的预订</span>
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link
                to="/app/admin"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/app/admin') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>管理面板</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-200">
          <Link
            to="/login"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>退出登录</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/app' && '仪表盘'}
                {location.pathname === '/app/rooms' && '会议室列表'}
                {location.pathname.startsWith('/app/rooms/') && '会议室详情'}
                {location.pathname.startsWith('/app/book/') && '预订会议室'}
                {location.pathname === '/app/my-bookings' && '我的预订'}
                {location.pathname === '/app/admin' && '管理面板'}
              </h2>
              <div className="flex items-center">
                <div className="relative">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    <Users className="h-full w-full text-gray-600" />
                  </span>
                </div>
                <span className="ml-3 font-medium">{user?.name || '未登录用户'}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
