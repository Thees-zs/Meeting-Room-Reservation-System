import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { fetchRooms, fetchBookings, rooms, bookings } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    initialData: rooms,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    initialData: bookings,
  });

  const availableRooms = roomsData.filter(room => room.status === 'available').length;
  const totalBookings = bookingsData.length;
  const pendingBookings = bookingsData.filter(booking => booking.status === 'pending').length;
  const todayBookings = bookingsData.filter(booking => 
    booking.startTime.startsWith(new Date().toISOString().split('T')[0])
  ).length;

  // Get upcoming bookings (today and future, not cancelled)
  const upcomingBookings = bookingsData
    .filter(booking => 
      new Date(booking.startTime) >= new Date() && 
      booking.status !== 'cancelled' &&
      booking.status !== 'rejected'
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">可用会议室</p>
              <p className="text-2xl font-semibold text-gray-700">{availableRooms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">总预订数</p>
              <p className="text-2xl font-semibold text-gray-700">{totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">待审批预订</p>
              <p className="text-2xl font-semibold text-gray-700">{pendingBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">今日会议</p>
              <p className="text-2xl font-semibold text-gray-700">{todayBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">即将到来的会议</h3>
          </div>
          <div className="p-6">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map(booking => {
                  const room = roomsData.find(r => r.id === booking.roomId);
                  return (
                    <div key={booking.id} className="flex items-center p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <Calendar className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-800">{booking.title}</h4>
                        <p className="text-sm text-gray-500">{room?.name} • {new Date(booking.startTime).toLocaleString()}</p>
                      </div>
                      <div className="ml-2">
                        {booking.status === 'approved' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">已批准</span>
                        )}
                        {booking.status === 'pending' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">待审批</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">没有即将到来的会议</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/my-bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                查看所有预订 →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">可用会议室</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {roomsData
                .filter(room => room.status === 'available')
                .slice(0, 3)
                .map(room => (
                  <div key={room.id} className="border rounded-lg overflow-hidden flex">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-24 h-24 object-cover"
                    />
                    <div className="p-4 flex-1">
                      <h4 className="font-medium text-gray-800">{room.name}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span>容纳 {room.capacity} 人</span>
                      </div>
                      <div className="mt-2">
                        <Link 
                          to={`/rooms/${room.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/rooms" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                查看所有会议室 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;