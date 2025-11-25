import { useState } from "react";

function MyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    country: "",
    password: "",
    bio: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.clear();
    console.log("SUBMITTED DATA:", formData);
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex",
      flexDirection: "column",
      width: "300px",
      gap: "10px",
      margin: "20px"
    }}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} />

      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      
      <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange}></textarea>

      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
