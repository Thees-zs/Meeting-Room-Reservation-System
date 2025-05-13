import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Users, MapPin, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchRoom, fetchRoomBookings, rooms, bookings } from '../data/mockData';
import RoomAvailabilityCalendar from '../components/RoomAvailabilityCalendar';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: room } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => fetchRoom(roomId),
    initialData: () => rooms.find(r => r.id === roomId),
    enabled: !!roomId,
  });

  const { data: roomBookings } = useQuery({
    queryKey: ['roomBookings', roomId],
    queryFn: () => fetchRoomBookings(roomId),
    initialData: () => bookings.filter(b => b.roomId === roomId),
    enabled: !!roomId,
  });

  if (!room) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium text-gray-800">会议室不存在</h3>
        <p className="mt-2 text-gray-500">找不到ID为 {id} 的会议室</p>
        <Link to="/rooms" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          返回会议室列表
        </Link>
      </div>
    );
  }

  // Get upcoming bookings for this room (not cancelled or rejected)
  const upcomingBookings = roomBookings
    .filter(booking => 
      new Date(booking.startTime) >= new Date() && 
      booking.status !== 'cancelled' &&
      booking.status !== 'rejected'
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img 
              src={room.image} 
              alt={room.name} 
              className="h-64 w-full object-cover md:w-64"
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
              <span className={`px-3 py-1 text-sm rounded-full ${
                room.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {room.status === 'available' ? '可用' : '维护中'}
              </span>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                <span>容纳 {room.capacity} 人</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <span>{room.location}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">设施</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {room.facilities.map((facility, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
            
            {room.status === 'available' && (
              <div className="mt-8">
                <Link 
                  to={`/book/${room.id}`}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  预订此会议室
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">即将到来的预订</h3>
        </div>
        <div className="p-6">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="flex items-center p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-800">{booking.title}</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">参会人数: {booking.attendees}</p>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-800">没有即将到来的预订</h3>
              <p className="mt-2 text-gray-500">此会议室当前没有预订</p>
            </div>
          )}
        </div>
      </div>

      {room.status === 'available' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">会议室可用时间</h3>
          </div>
          <div className="p-6">
            <RoomAvailabilityCalendar 
              roomId={room.id}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onTimeSelect={({start, end}) => {
                navigate(`/book/${room.id}`, {
                  state: {
                    startTime: `${format(selectedDate, 'yyyy-MM-dd')}T${start}`,
                    endTime: `${format(selectedDate, 'yyyy-MM-dd')}T${end}`
                  }
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
