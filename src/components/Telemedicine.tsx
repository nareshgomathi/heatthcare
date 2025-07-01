import React, { useState } from 'react';
import { Video, Calendar, Clock, User, Star, MapPin, Phone, Mail, Filter, CheckCircle, Send } from 'lucide-react';

export default function Telemedicine() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('Video Call');
  const [reason, setReason] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success'>('idle');
  const [bookedAppointments, setBookedAppointments] = useState<Set<number>>(new Set());

  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'general', name: 'General Medicine' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'psychiatry', name: 'Psychiatry' },
    { id: 'pediatrics', name: 'Pediatrics' }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.9,
      experience: '15 years',
      location: 'New York, NY',
      price: '$75',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      nextAvailable: 'Today 2:30 PM',
      languages: ['English', 'Spanish'],
      email: 'sarah.johnson@smartcare.com'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: '12 years',
      location: 'Los Angeles, CA',
      price: '$120',
      image: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      nextAvailable: 'Tomorrow 10:00 AM',
      languages: ['English', 'Mandarin'],
      email: 'michael.chen@smartcare.com'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.7,
      experience: '8 years',
      location: 'Miami, FL',
      price: '$90',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      nextAvailable: 'Today 4:15 PM',
      languages: ['English', 'Spanish'],
      email: 'emily.rodriguez@smartcare.com'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Psychiatry',
      rating: 4.9,
      experience: '20 years',
      location: 'Chicago, IL',
      price: '$150',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      nextAvailable: 'Today 6:00 PM',
      languages: ['English'],
      email: 'james.wilson@smartcare.com'
    }
  ];

  const filteredDoctors = selectedSpecialty === 'all' 
    ? doctors 
    : doctors.filter(doctor => doctor.specialty.toLowerCase().includes(selectedSpecialty));

  const timeSlots = [
    '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setBookingStatus('booking');

    // Simulate booking process
    setTimeout(() => {
      setBookedAppointments(prev => new Set([...prev, selectedDoctor]));
      setBookingStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setBookingStatus('idle');
        setSelectedDate('');
        setSelectedTime('');
        setReason('');
      }, 3000);
    }, 2000);
  };

  const handleQuickBook = (doctorId: number) => {
    if (bookedAppointments.has(doctorId)) return;
    
    setSelectedDoctor(doctorId);
    setBookingStatus('booking');
    
    // Simulate quick booking
    setTimeout(() => {
      setBookedAppointments(prev => new Set([...prev, doctorId]));
      setBookingStatus('success');
      
      setTimeout(() => {
        setBookingStatus('idle');
      }, 3000);
    }, 1500);
  };

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Telemedicine Portal
          </h1>
          <p className="text-xl text-gray-600">
            Connect with certified doctors through secure video consultations
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Available Today</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Available This Week</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$50</span>
                    <span>$200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredDoctors.map((doctor) => {
                const isBooked = bookedAppointments.has(doctor.id);
                
                return (
                  <div
                    key={doctor.id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => !isBooked && setSelectedDoctor(doctor.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span>{doctor.rating}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{doctor.experience}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{doctor.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{doctor.price}</div>
                            <div className="text-sm text-gray-600">per consultation</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Next Available:</p>
                            <p className="text-sm font-semibold text-green-600">{doctor.nextAvailable}</p>
                          </div>
                          <div className="flex space-x-2">
                            {isBooked ? (
                              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Booked</span>
                              </div>
                            ) : (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickBook(doctor.id);
                                  }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                  <Video className="h-4 w-4" />
                                  <span>Book Now</span>
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                  <Phone className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Languages:</span>
                          {doctor.languages.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            {selectedDoctor ? (
              <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
                {bookingStatus === 'success' ? (
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Booking Confirmed!
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your appointment with {selectedDoctorData?.name} has been successfully booked.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                      <div className="flex items-center space-x-2 text-blue-700 mb-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">Email Sent</span>
                      </div>
                      <p className="text-xs text-blue-600">
                        Confirmation details sent to your email and {selectedDoctorData?.email}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Date:</strong> {selectedDate || 'Today'}</p>
                      <p><strong>Time:</strong> {selectedTime || selectedDoctorData?.nextAvailable}</p>
                      <p><strong>Type:</strong> {consultationType}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Book Appointment
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Times
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                                selectedTime === time
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consultation Type
                        </label>
                        <select 
                          value={consultationType}
                          onChange={(e) => setConsultationType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option>Video Call</option>
                          <option>Phone Call</option>
                          <option>Chat Only</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for Visit
                        </label>
                        <textarea
                          rows={3}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Brief description of your concerns..."
                        ></textarea>
                      </div>
                      
                      <button 
                        onClick={handleBookAppointment}
                        disabled={bookingStatus === 'booking' || !selectedDate || !selectedTime}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {bookingStatus === 'booking' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Booking...</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4" />
                            <span>Confirm Booking</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a doctor to book an appointment</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}