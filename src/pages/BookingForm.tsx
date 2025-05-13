import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRoom, createBooking, rooms } from '../data/mockData';

const BookingForm: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const parsedRoomId = parseInt(roomId || '0', 10);

  const { data: room } = useQuery({
    queryKey: ['room', parsedRoomId],
    queryFn: () => fetchRoom(parsedRoomId),
    initialData: () => rooms.find(r => r.id === parsedRoomId),
    enabled: !!parsedRoomId,
  });

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    attendees: 1,
    purpose: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['roomBookings', parsedRoomId] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      navigate('/my-bookings', { state: { success: true } });
    },
  });

  if (!room) {
    return <div>会议室不存在</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入会议标题';
    }
    
    if (!formData.date) {
      newErrors.date = '请选择日期';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = '请选择开始时间';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = '请选择结束时间';
    }
    
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = '结束时间必须晚于开始时间';
    }
    
    if (formData.attendees <= 0) {
      newErrors.attendees = '参会人数必须大于0';
    }
    
    if (formData.attendees > room.capacity) {
      newErrors.attendees = `参会人数不能超过会议室容量 (${room.capacity}人)`;
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = '请输入会议目的';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const startDateTime = `${formData.date}T${formData.startTime}`;
    const endDateTime = `${formData.date}T${formData.endTime}`;
    
    bookingMutation.mutate({
      roomId: parsedRoomId,
      userId: 1, // Assuming current user is admin
      title: formData.title,
      startTime: startDateTime,
      endTime: endDateTime,
      attendees: formData.attendees,
      purpose: formData.purpose,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">预订会议室: {room.name}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                会议标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
              
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.endTime ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
                参会人数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                min="1"
                max={room.capacity}
                className={`mt-1 block w-full rounded-md border ${
                  errors.attendees ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.attendees ? (
                <p className="mt-1 text-sm text-red-500">{errors.attendees}</p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">此会议室最多容纳 {room.capacity} 人</p>
              )}
            </div>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                会议目的 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className={`mt-1 block w-full rounded-md border ${
                  errors.purpose ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? '提交中...' : '提交预订'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;