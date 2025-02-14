import React, { useState } from 'react';

const generateId = () => Math.random().toString(36).substr(2, 9);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-3 py-2 md:px-4 md:py-2 rounded-md font-semibold transition-all duration-200 transform hover:scale-105 text-sm md:text-base w-full md:w-auto';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, className = '' }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full border-2 border-gray-200 rounded-md p-2 text-sm md:text-base focus:border-blue-500 focus:outline-none transition-colors duration-200 ${className}`}
  />
);

const Select = ({ value, onChange, options, placeholder, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full border-2 border-gray-200 rounded-md p-2 text-sm md:text-base focus:border-blue-500 focus:outline-none transition-colors duration-200 ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.id} value={option.id}>{option.name}</option>
    ))}
  </select>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('courseTypes');
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [newCourseType, setNewCourseType] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentName, setStudentName] = useState('');
  const [editMode, setEditMode] = useState({ type: '', id: null });
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('');
  const handleAddCourseType = (e) => {
    e.preventDefault();
    if (newCourseType.trim()) {
      setCourseTypes([...courseTypes, { id: generateId(), name: newCourseType }]);
      setNewCourseType('');
    }
  };

  const handleDeleteCourseType = (id) => {
    setCourseTypes(courseTypes.filter(type => type.id !== id));
    setCourseOfferings(courseOfferings.filter(offering => offering.courseTypeId !== id));
  };

  const handleUpdateCourseType = (id, newName) => {
    setCourseTypes(courseTypes.map(type => 
      type.id === id ? { ...type, name: newName } : type
    ));
    setEditMode({ type: '', id: null });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (newCourse.trim()) {
      setCourses([...courses, { id: generateId(), name: newCourse }]);
      setNewCourse('');
    }
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    setCourseOfferings(courseOfferings.filter(offering => offering.courseId !== id));
  };

  const handleUpdateCourse = (id, newName) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, name: newName } : course
    ));
    setEditMode({ type: '', id: null });
  };

  const handleAddCourseOffering = (e) => {
    e.preventDefault();
    if (selectedCourseType && selectedCourse) {
      const courseType = courseTypes.find(type => type.id === selectedCourseType);
      const course = courses.find(c => c.id === selectedCourse);
      
      setCourseOfferings([...courseOfferings, {
        id: generateId(),
        courseTypeId: selectedCourseType,
        courseId: selectedCourse,
        name: `${courseType.name} - ${course.name}`
      }]);
      
      setSelectedCourseType('');
      setSelectedCourse('');
    }
  };

  const handleDeleteCourseOffering = (id) => {
    setCourseOfferings(courseOfferings.filter(offering => offering.id !== id));
    setRegistrations(registrations.filter(reg => reg.courseOfferingId !== id));
  };

  const handleRegisterStudent = (e, courseOfferingId) => {
    e.preventDefault();
    if (studentName.trim()) {
      setRegistrations([...registrations, {
        id: generateId(),
        studentName,
        courseOfferingId,
        registrationDate: new Date().toISOString()
      }]);
      setStudentName('');
    }
  };

  const filteredOfferings = selectedTypeFilter
    ? courseOfferings.filter(offering => offering.courseTypeId === selectedTypeFilter)
    : courseOfferings;


  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
          Student Registration System
        </h1>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
          {['courseTypes', 'courses', 'offerings', 'registrations'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'secondary'}
              onClick={() => setActiveTab(tab)}
              className="capitalize text-xs md:text-base flex-1 md:flex-none max-w-[150px]"
            >
              {tab.replace(/([A-Z])/g, ' $1').trim()}
            </Button>
          ))}
        </div>

        {activeTab === 'courseTypes' && (
          <Card>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Course Types</h2>
            <form onSubmit={handleAddCourseType} className="mb-4 md:mb-6 flex flex-col md:flex-row gap-2 md:gap-4">
              <Input
                value={newCourseType}
                onChange={(e) => setNewCourseType(e.target.value)}
                placeholder="Enter course type"
                className="flex-grow"
              />
              <Button type="submit">Add Course Type</Button>
            </form>
            <div className="grid gap-3 md:gap-4">
              {courseTypes.map(type => (
                <div key={type.id} className="bg-white rounded-lg p-3 md:p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2">
                  {editMode.type === 'courseType' && editMode.id === type.id ? (
                    <Input
                      defaultValue={type.name}
                      onBlur={(e) => handleUpdateCourseType(type.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-base md:text-lg text-center md:text-left">{type.name}</span>
                  )}
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      variant="secondary"
                      onClick={() => setEditMode({ type: 'courseType', id: type.id })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteCourseType(type.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'courses' && (
          <Card>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Courses</h2>
            <form onSubmit={handleAddCourse} className="mb-4 md:mb-6 flex flex-col md:flex-row gap-2 md:gap-4">
              <Input
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Enter course name"
                className="flex-grow"
              />
              <Button type="submit">Add Course</Button>
            </form>
            <div className="grid gap-3 md:gap-4">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-lg p-3 md:p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2">
                  {editMode.type === 'course' && editMode.id === course.id ? (
                    <Input
                      defaultValue={course.name}
                      onBlur={(e) => handleUpdateCourse(course.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-base md:text-lg text-center md:text-left">{course.name}</span>
                  )}
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      variant="secondary"
                      onClick={() => setEditMode({ type: 'course', id: course.id })}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'offerings' && (
          <Card>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Course Offerings</h2>
            <form onSubmit={handleAddCourseOffering} className="mb-4 md:mb-6 flex flex-col gap-2">
              <Select
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                options={courseTypes}
                placeholder="Select Course Type"
              />
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                options={courses}
                placeholder="Select Course"
              />
              <Button type="submit">Create Offering</Button>
            </form>
            <Select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              options={courseTypes}
              placeholder="Filter by Course Type"
              className="mb-4 md:mb-6"
            />
            <div className="grid gap-4 md:gap-6">
              {filteredOfferings.map(offering => (
                <div key={offering.id} className="bg-white rounded-lg p-4 md:p-6 shadow-md">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center md:text-left">{offering.name}</h3>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteCourseOffering(offering.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <form onSubmit={(e) => handleRegisterStudent(e, offering.id)} className="mb-4 flex flex-col md:flex-row gap-2">
                    <Input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter student name"
                      className="flex-grow"
                    />
                    <Button variant="success" type="submit">Register Student</Button>
                  </form>
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <h4 className="font-semibold mb-2 md:mb-3 text-gray-700">Registered Students</h4>
                    <ul className="space-y-2">
                      {registrations
                        .filter(reg => reg.courseOfferingId === offering.id)
                        .map(reg => (
                          <li key={reg.id} className="flex flex-col md:flex-row justify-between items-center gap-1 text-gray-600">
                            <span>{reg.studentName}</span>
                            <span className="text-sm">
                              {new Date(reg.registrationDate).toLocaleDateString()}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'registrations' && (
          <Card>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">All Registrations</h2>
            <div className="space-y-3 md:space-y-4">
              {registrations.map(reg => {
                const offering = courseOfferings.find(o => o.id === reg.courseOfferingId);
                return (
                  <div key={reg.id} className="bg-white rounded-lg p-3 md:p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="text-center md:text-left">
                      <span className="font-semibold block md:inline">{reg.studentName}</span>
                      <span className="hidden md:inline text-gray-500 mx-2">•</span>
                      <span className="text-gray-600 block md:inline">{offering?.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;