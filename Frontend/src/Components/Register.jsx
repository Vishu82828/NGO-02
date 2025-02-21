import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    father_name: '',
    birth_date: '',
    address: '',
    qualification: '',
    passport_photo: null,
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    if (e.target.name === 'passport_photo') {
      setFormData({ ...formData, passport_photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => formDataObj.append(key, formData[key]));

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="middle_name" placeholder="Middle Name" onChange={handleChange} />
      <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
      <input type="file" name="passport_photo" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
