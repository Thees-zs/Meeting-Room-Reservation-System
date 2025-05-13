import React from 'react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchRoomBookings } from '../data/mockData';

interface TimeSlot {
  start: string;
  end: string;
  status: 'available' | 'booked' | 'unavailable';
}

interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}

interface RoomAvailabilityCalendarProps {
  roomId: number;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: { start: string; end: string }) => void;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8; // 8am
  const endHour = 20; // 8pm
  
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(hour + 1, 0, 0);
    
    slots.push({
      start: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      end: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
      status: 'available'
    });
  }
  
  return slots;
};

const RoomAvailabilityCalendar: React.FC<RoomAvailabilityCalendarProps> = ({ 
  roomId, 
  selectedDate = new Date(),
  onDateSelect,
  onTimeSelect
}) => {
  const [availability, setAvailability] = React.useState<DayAvailability[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookings = await fetchRoomBookings(roomId);
        const days: DayAvailability[] = [];
        
        // Generate availability for next 7 days
        for (let i = 0; i < 7; i++) {
          const date = addDays(new Date(), i);
          const slots = generateTimeSlots(new Date(date));
          
          // Mark booked slots
          bookings.forEach(booking => {
            const bookingDate = parseISO(booking.startTime);
            if (isSameDay(bookingDate, date)) {
              const bookingStart = format(bookingDate, 'HH:mm');
              const bookingEnd = format(parseISO(booking.endTime), 'HH:mm');
              
              slots.forEach(slot => {
                const slotStart = format(parseISO(slot.start), 'HH:mm');
                const slotEnd = format(parseISO(slot.end), 'HH:mm');
                
                if (
                  (slotStart >= bookingStart && slotStart < bookingEnd) ||
                  (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                  (slotStart <= bookingStart && slotEnd >= bookingEnd)
                ) {
                  slot.status = booking.status === 'approved' ? 'booked' : 'available';
                }
              });
            }
          });
          
          days.push({ date, slots });
        }
        
        setAvailability(days);
      } catch (err) {
        setError('Failed to load availability');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAvailability();
  }, [roomId]);

  const handleTimeSelect = (day: DayAvailability, slot: TimeSlot) => {
    if (slot.status === 'available' && onTimeSelect) {
      onTimeSelect({
        start: format(parseISO(slot.start), 'HH:mm'),
        end: format(parseISO(slot.end), 'HH:mm')
      });
    }
  };

  if (loading) return <div>Loading availability...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-500 mr-1" />
          <span>可预订</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500 mr-1" />
          <span>已预订</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {availability.map(day => (
            <div 
              key={day.date.toString()}
              className={`w-48 border rounded-lg p-2 ${
                isSameDay(day.date, selectedDate) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => onDateSelect?.(day.date)}
            >
              <div className="text-center font-medium">
                {format(day.date, 'MM/dd')} {format(day.date, 'EEE')}
              </div>
              
              <div className="mt-2 space-y-1">
                {day.slots.map((slot, i) => (
                  <div
                    key={i}
                    className={`p-2 text-xs rounded cursor-pointer flex items-center ${
                      slot.status === 'available'
                        ? 'bg-green-100 hover:bg-green-200 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTimeSelect(day, slot);
                    }}
                  >
                    {slot.status === 'available' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {format(parseISO(slot.start), 'HH:mm')}-{format(parseISO(slot.end), 'HH:mm')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        {format(parseISO(slot.start), 'HH:mm')}-{format(parseISO(slot.end), 'HH:mm')}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityCalendar;
