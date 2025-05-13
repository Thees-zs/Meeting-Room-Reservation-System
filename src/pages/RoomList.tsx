import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Search, Filter } from 'lucide-react';
import { fetchRooms, rooms } from '../data/mockData';

const RoomList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<number | ''>('');
  const [locationFilter, setLocationFilter] = useState<string>('');

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    initialData: rooms,
  });

  const filteredRooms = roomsData.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = capacityFilter === '' || room.capacity >= Number(capacityFilter);
    const matchesLocation = locationFilter === '' || room.location === locationFilter;
    return matchesSearch && matchesCapacity && matchesLocation;
  });

  const locations = Array.from(new Set(roomsData.map(room => room.location)));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索会议室..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">所有容量</option>
                <option value="5">5人以上</option>
                <option value="10">10人以上</option>
                <option value="20">20人以上</option>
                <option value="50">50人以上</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">所有位置</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src={room.image} 
              alt={room.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-800">{room.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  room.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {room.status === 'available' ? '可用' : '维护中'}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>容纳 {room.capacity} 人</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{room.location}</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {room.facilities.map((facility, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {facility}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Link 
                  to={`/rooms/${room.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  查看详情
                </Link>
                {room.status === 'available' && (
                  <Link 
                    to={`/book/${room.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    预订
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Filter className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">没有找到符合条件的会议室</h3>
          <p className="mt-2 text-gray-500">请尝试调整搜索条件</p>
        </div>
      )}
    </div>
  );
};

export default RoomList;