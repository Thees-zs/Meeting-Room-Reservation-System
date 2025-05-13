import { addDays, addHours, format, setHours, setMinutes } from 'date-fns';

// Types
export interface Room {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  location: string;
  facilities: string[];
  image: string;
  status: 'available' | 'reserved' | 'maintenance' | 'cleaning';
  minBookingHours?: number;
  maxCapacity?: number;
  bookingRules?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: 'admin' | 'user';
  password: string;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  title: string;
  startTime: string;
  endTime: string;
  attendees: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
}

// Today's date for generating mock data
const today = new Date();

// Mock data
export const rooms: Room[] = [
  {
    id: 1,
    name: '工程制造管理中心 A101',
    capacity: 10,
    location: '主楼 1 楼',
    facilities: ['投影仪', 'WiFi', '白板', '视频会议系统'],
    image: 'https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
  },
  {
    id: 2,
    name: '工程制造管理中心 B205',
    capacity: 20,
    location: '主楼 2 楼',
    facilities: ['投影仪', 'WiFi', '白板', '音响系统', '视频会议系统'],
    image: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
  },
  {
    id: 3,
    name: '工程制造管理中心 C310',
    capacity: 30,
    location: '主楼 3 楼',
    facilities: ['投影仪', 'WiFi', '白板', '音响系统', '视频会议系统', '茶水服务'],
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'maintenance',
  },
  {
    id: 4,
    name: '工程制造管理中心 D102',
    capacity: 6,
    location: '副楼 1 楼',
    facilities: ['电视屏幕', 'WiFi', '白板'],
    image: 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
  },
  {
    id: 5,
    name: '工程制造管理中心 E001',
    capacity: 100,
    location: '主楼 1 楼',
    facilities: ['投影仪', 'WiFi', '音响系统', '麦克风', '视频会议系统', '茶水服务'],
    image: 'https://images.pexels.com/photos/159806/meeting-modern-room-conference-159806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
  },
];

export const users: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    department: '研发部',
    role: 'admin',
    password: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'active',
    createdAt: format(addDays(today, -30), "yyyy-MM-dd'T'HH:mm"),
    lastLogin: format(today, "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    department: '市场部',
    role: 'user',
    password: 'user',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'active',
    createdAt: format(addDays(today, -15), "yyyy-MM-dd'T'HH:mm"),
    lastLogin: format(addDays(today, -1), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    department: '人力资源部',
    role: 'user',
    password: 'user',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'active',
    createdAt: format(addDays(today, -20), "yyyy-MM-dd'T'HH:mm"),
    lastLogin: format(addDays(today, -3), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 4,
    name: '测试用户',
    email: 'user@example.com',
    phone: '13800138004',
    department: '测试部',
    role: 'user',
    password: 'user',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    status: 'inactive',
    createdAt: format(addDays(today, -10), "yyyy-MM-dd'T'HH:mm"),
    lastLogin: format(addDays(today, -30), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 5,
    name: '测试管理员',
    email: 'admin@example.com',
    phone: '13800138005',
    department: '管理部',
    role: 'admin',
    password: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    status: 'active',
    createdAt: format(addDays(today, -25), "yyyy-MM-dd'T'HH:mm"),
    lastLogin: format(addHours(today, -2), "yyyy-MM-dd'T'HH:mm"),
  },
];

// Generate some bookings for the next 7 days
export const bookings: Booking[] = [
  {
    id: 1,
    roomId: 1,
    userId: 2,
    title: '项目启动会议',
    startTime: format(setHours(setMinutes(today, 0), 10), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setHours(setMinutes(today, 0), 12), "yyyy-MM-dd'T'HH:mm"),
    attendees: 8,
    purpose: '讨论新项目启动计划',
    status: 'approved',
    createdAt: format(addDays(today, -2), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 2,
    roomId: 2,
    userId: 3,
    title: '部门季度会议',
    startTime: format(setHours(setMinutes(addDays(today, 1), 0), 14), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setHours(setMinutes(addDays(today, 1), 0), 16), "yyyy-MM-dd'T'HH:mm"),
    attendees: 15,
    purpose: '回顾季度工作成果',
    status: 'approved',
    createdAt: format(addDays(today, -3), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 3,
    roomId: 4,
    userId: 1,
    title: '技术评审会议',
    startTime: format(setHours(setMinutes(addDays(today, 2), 0), 9), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setHours(setMinutes(addDays(today, 2), 0), 11), "yyyy-MM-dd'T'HH:mm"),
    attendees: 5,
    purpose: '评审新功能技术方案',
    status: 'pending',
    createdAt: format(addDays(today, -1), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 4,
    roomId: 5,
    userId: 2,
    title: '全体员工大会',
    startTime: format(setHours(setMinutes(addDays(today, 3), 0), 15), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setHours(setMinutes(addDays(today, 3), 0), 17), "yyyy-MM-dd'T'HH:mm"),
    attendees: 80,
    purpose: '公司战略发布会',
    status: 'approved',
    createdAt: format(addDays(today, -5), "yyyy-MM-dd'T'HH:mm"),
  },
  {
    id: 5,
    roomId: 3,
    userId: 3,
    title: '客户演示会议',
    startTime: format(setHours(setMinutes(addDays(today, 4), 0), 13), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setHours(setMinutes(addDays(today, 4), 0), 15), "yyyy-MM-dd'T'HH:mm"),
    attendees: 25,
    purpose: '向客户展示产品新功能',
    status: 'cancelled',
    createdAt: format(addDays(today, -4), "yyyy-MM-dd'T'HH:mm"),
  },
];

// Helper functions
export const hashPassword = (password: string): string => {
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

// Helper functions to simulate API calls
export const fetchRooms = (): Promise<Room[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rooms);
    }, 500);
  });
};

export const fetchRoom = (id: number): Promise<Room | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rooms.find(room => room.id === id));
    }, 300);
  });
};

export const fetchBookings = (): Promise<Booking[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bookings);
    }, 500);
  });
};

export const fetchUserBookings = (userId: number): Promise<Booking[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bookings.filter(booking => booking.userId === userId));
    }, 300);
  });
};

export const fetchRoomBookings = (roomId: number): Promise<Booking[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bookings.filter(booking => booking.roomId === roomId));
    }, 300);
  });
};

export const fetchUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 300);
  });
};

export const createBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBooking: Booking = {
        ...booking,
        id: bookings.length + 1,
        status: 'pending',
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      };
      bookings.push(newBooking);
      resolve(newBooking);
    }, 500);
  });
};

export const updateBookingStatus = (id: number, status: Booking['status']): Promise<Booking> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookingIndex = bookings.findIndex(b => b.id === id);
      if (bookingIndex === -1) {
        reject(new Error('Booking not found'));
        return;
      }
      
      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        status,
      };
      
      resolve(bookings[bookingIndex]);
    }, 300);
  });
};
