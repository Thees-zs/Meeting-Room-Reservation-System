import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { format } from 'date-fns';
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { fetchBookings, fetchRooms, fetchUsers, updateBookingStatus, rooms, bookings, users, Room, User, hashPassword } from '../data/mockData';

interface RoomFormProps {
  room?: Room;
  onSave: (room: Room) => void;
  onCancel: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Room, 'id'>>(
    room || {
      name: '',
      description: '',
      capacity: 10,
      location: '',
      facilities: [],
      image: '',
      status: 'available',
      minBookingHours: 1,
      maxCapacity: 20,
      bookingRules: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: room?.id || Date.now()
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        {room ? '编辑会议室' : '添加会议室'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">会议室名称</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* 其他表单字段省略 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

interface UserFormProps {
  user?: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>(
    user || {
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'user',
      password: '',
      avatar: '',
      status: 'active',
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm")
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: user?.id || Date.now()
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        {user ? '编辑用户' : '添加用户'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">姓名</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">邮箱</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">电话</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">部门</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">角色</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">状态</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">激活</option>
            <option value="inactive">禁用</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">头像URL</label>
          <input
            type="url"
            value={formData.avatar || ''}
            onChange={(e) => setFormData({...formData, avatar: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {!user && (
          <div>
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('AdminPanel user check:', user);
    if (user?.role !== 'admin') {
      console.log('Redirecting non-admin user');
      navigate('/login');
    }
  }, [navigate]);

  const { data: bookingsData } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    initialData: bookings,
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { data: roomsData, refetch: refetchRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    initialData: rooms,
  });

  const addRoomMutation = useMutation({
    mutationFn: (room: Room) => {
      rooms.push(room);
      return Promise.resolve(room);
    },
    onSuccess: () => {
      refetchRooms();
      setActiveTab('rooms');
    }
  });

  const updateRoomMutation = useMutation({
    mutationFn: (room: Room) => {
      const index = rooms.findIndex(r => r.id === room.id);
      if (index >= 0) {
        rooms[index] = room;
      }
      return Promise.resolve(room);
    },
    onSuccess: () => {
      refetchRooms();
      setActiveTab('rooms');
    }
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: number) => {
      const index = rooms.findIndex(r => r.id === id);
      if (index >= 0) {
        rooms.splice(index, 1);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      refetchRooms();
    }
  });

  const handleAddRoom = (room: Room) => {
    addRoomMutation.mutate(room);
  };

  const handleUpdateRoom = (room: Room) => {
    updateRoomMutation.mutate(room);
  };

  const deleteRoom = (id: number) => {
    deleteRoomMutation.mutate(id);
  };

  // 用户管理相关函数
  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialData: users,
  });

  const addUserMutation = useMutation({
    mutationFn: (user: User) => {
      users.push(user);
      return Promise.resolve(user);
    },
    onSuccess: () => {
      refetchUsers();
      setActiveTab('users');
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => {
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      }
      return Promise.resolve(user);
    },
    onSuccess: () => {
      refetchUsers();
      setActiveTab('users');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => {
      const index = users.findIndex(u => u.id === id);
      if (index >= 0) {
        users.splice(index, 1);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      refetchUsers();
    }
  });

  const handleAddUser = (user: User) => {
    // Hash password before saving
    const userWithHashedPassword = {
      ...user,
      password: hashPassword(user.password)
    };
    addUserMutation.mutate(userWithHashedPassword);
  };

  const handleUpdateUser = (user: User) => {
    // Only hash password if it's being changed (not empty)
    const userWithHashedPassword = user.password 
      ? { ...user, password: hashPassword(user.password) }
      : user;
    updateUserMutation.mutate(userWithHashedPassword);
  };

  const deleteUser = (id: number) => {
    if (window.confirm('确定要删除此用户吗？')) {
      deleteUserMutation.mutate(id);
    }
  };

  const approveMutation = useMutation({
    mutationFn: (id: number) => updateBookingStatus(id, 'approved'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => updateBookingStatus(id, 'rejected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleApprove = (id: number) => {
    if (window.confirm('确定要批准此预订请求吗？')) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: number) => {
    if (window.confirm('确定要拒绝此预订请求吗？')) {
      rejectMutation.mutate(id);
    }
  };

  const pendingBookings = bookingsData.filter(booking => booking.status === 'pending');
  const approvedBookings = bookingsData.filter(booking => booking.status === 'approved');
  const rejectedBookings = bookingsData.filter(booking => booking.status === 'rejected' || booking.status === 'cancelled');

  const getRoomById = (id: number) => {
    return roomsData.find(room => room.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              预订管理
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rooms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              会议室管理
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('users')}
            >
              用户管理
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">待审批预订 ({pendingBookings.length})</h3>
                {pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map(booking => {
                      const room = getRoomById(booking.roomId);
                      return (
                        <div key={booking.id} className="border rounded-lg overflow-hidden">
                          <div className="p-6">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-medium text-gray-800">{booking.title}</h4>
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                待审批
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
                            
                            <div className="mt-6 flex justify-end space-x-4">
                              <button
                                onClick={() => handleReject(booking.id)}
                                className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                disabled={rejectMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                拒绝
                              </button>
                              <button
                                onClick={() => handleApprove(booking.id)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                disabled={approveMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                批准
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-800">没有待审批的预订</h3>
                    <p className="mt-2 text-gray-500">当前没有需要审批的预订请求</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">已批准预订 ({approvedBookings.length})</h3>
                {approvedBookings.length > 0 && (
                  <div className="space-y-4">
                    {approvedBookings.map(booking => {
                      const room = getRoomById(booking.roomId);
                      return (
                        <div key={booking.id} className="flex items-center p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="p-2 rounded-full bg-green-100 text-green-600">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-800">{booking.title}</h4>
                            <p className="text-sm text-gray-500">
                              {room?.name} • {new Date(booking.startTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="ml-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">已批准</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">会议室管理</h3>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  onClick={() => setActiveTab('add-room')}
                >
                  添加会议室
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        会议室
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        位置
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        容量
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roomsData.map(room => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full object-cover" src={room.image} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{room.name}</div>
                              <div className="text-sm text-gray-500">{room.facilities.join(', ')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{room.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{room.capacity} 人</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            room.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {room.status === 'available' ? '可用' : '维护中'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            onClick={() => {
                              setActiveTab('edit-room');
                              setEditingRoom(room);
                            }}
                          >
                            编辑
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => {
                              if (window.confirm(`确定要删除会议室 ${room.name} 吗？`)) {
                                deleteRoom(room.id);
                              }
                            }}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add-room' && (
            <RoomForm 
              onSave={handleAddRoom}
              onCancel={() => setActiveTab('rooms')}
            />
          )}

          {activeTab === 'edit-room' && editingRoom && (
            <RoomForm 
              room={editingRoom}
              onSave={handleUpdateRoom}
              onCancel={() => setActiveTab('rooms')}
            />
          )}

          {activeTab === 'add-user' && (
            <UserForm 
              onSave={handleAddUser}
              onCancel={() => setActiveTab('users')}
            />
          )}

          {activeTab === 'edit-user' && editingUser && (
            <UserForm 
              user={editingUser}
              onSave={handleUpdateUser}
              onCancel={() => setActiveTab('users')}
            />
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">用户管理</h3>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  onClick={() => setActiveTab('add-user')}
                >
                  添加用户
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        部门
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        角色
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersData.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? '管理员' : '普通用户'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            onClick={() => {
                              setActiveTab('edit-user');
                              setEditingUser(user);
                            }}
                          >
                            编辑
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteUser(user.id)}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
