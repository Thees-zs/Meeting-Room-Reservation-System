import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { fetchUserBookings, fetchRooms, updateBookingStatus, rooms, bookings } from '../data/mockData';

const MyBookings: React.FC = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const showSuccessMessage = location.state?.success;

  // In a real app, we would get the current user ID from auth context
  const currentUserId = 1;

  const { data: userBookings } = useQuery({
    queryKey: ['userBookings', currentUserId],
    queryFn: () => fetchUserBookings(currentUserId),
    initialData: () => bookings.filter(b => b.userId === currentUserId),
  });

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    initialData: rooms,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => updateBookingStatus(id, 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  // Group bookings by status
  const upcomingBookings = userBookings.filter(
    booking => new Date(booking.startTime) >= new Date() && booking.status !== 'cancelled' && booking.status !== 'rejected'
  );
  
  const pastBookings = userBookings.filter(
    booking => new Date(booking.startTime) < new Date() || booking.status === 'cancelled' || booking.status === 'rejected'
  );

  const handleCancel = (id: number) => {
    if (window.confirm('确定要取消此预订吗？')) {
      cancelMutation.mutate(id);
    }
  };

  const getRoomById = (id: number) => {
    return roomsData.find(room => room.id === id);
  };

  return (
    <div className="space-y-6">
      {showSuccessMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                预订申请已成功提交，等待管理员审批。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">即将到来的预订</h3>
        </div>
        <div className="p-6">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-6">
              {upcomingBookings.map(booking => {
                const room = getRoomById(booking.roomId);
                return (
                  <div key={booking.id} className="border rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-gray-800">{booking.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === 'approved' ? '已批准' : '待审批'}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{room?.name} ({room?.location})</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{booking.attendees} 人参会</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">会议目的:</span> {booking.purpose}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          取消预订
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-800">没有即将到来的预订</h3>
              <p className="mt-2 text-gray-500">您当前没有任何预订</p>
            </div>
          )}
        </div>
      </div>

      {pastBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">历史预订</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pastBookings.map(booking => {
                const room = getRoomById(booking.roomId);
                return (
                  <div key={booking.id} className="flex items-center p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${
                        booking.status === 'cancelled' || booking.status === 'rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {booking.status === 'cancelled' || booking.status === 'rejected' 
                          ? <XCircle className="h-6 w-6" />
                          : <CheckCircle className="h-6 w-6" />
                        }
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-800">{booking.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : booking.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'cancelled' 
                            ? '已取消' 
                            : booking.status === 'rejected'
                              ? '已拒绝'
                              : '已完成'
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {room?.name} • {new Date(booking.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;