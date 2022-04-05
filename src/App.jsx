import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const defaultFormData = {
  name: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  street: ""
};

export default function App() {
  const [address, setAddress] = useState([]);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [formPopUp, setFormPopUp] = useState(false);
  const [disableEditBtn, setDisableEditBtn] = useState(true);

  const changeHandler = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
    // console.log({ [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setLoader(true);
    (async () => {
      try {
        const res = await axios.get(
          "https://624b163d71e21eebbcec9f15.mockapi.io/address"
        );
        // console.log(res);
        if (res.status === 200) {
          setLoader(false);
          setAddress(res.data);
        }
      } catch (e) {
        console.error(e.message);
      }
    })();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post(
        "https://624b163d71e21eebbcec9f15.mockapi.io/address",
        {
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          street: formData.street
        }
      );
      if (res.status === 201) {
        setLoader(false);
        setFormPopUp(false);
        setAddress((prevAddress) => [...prevAddress, res.data]);
        setFormData(defaultFormData);
      }
      console.log(res);
    } catch (e) {
      console.error(e.message);
    }
  };

  const deleteHandler = async (id) => {
    setLoader(true);
    try {
      const res = await axios.delete(
        `https://624b163d71e21eebbcec9f15.mockapi.io/address/${id}`
      );
      // console.log(res);
      if (res.status === 200) {
        setLoader(false);
        setAddress((prevAddress) =>
          prevAddress.filter((address) => address.id !== res.data.id)
        );
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const editClickHandler = (addressObj) => {
    setFormData(addressObj);
    setFormPopUp(true);
    setDisableEditBtn(false);
  };

  const updateHandler = async () => {
    setLoader(true);
    try {
      const res = await axios.put(
        `https://624b163d71e21eebbcec9f15.mockapi.io/address/${formData.id}`,
        formData
      );
      // console.log(res);
      if (res.status === 200) {
        setFormPopUp(false);
        setLoader(false);
        setAddress((prevAddress) =>
          prevAddress.map((address) =>
            address.id === res.data.id ? res.data : address
          )
        );
        setFormData(defaultFormData);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  // App
  return (
    <div className="App">
      <h1 className="mt-2">
        Address Management{" "}
        <span role="img" aria-label="emoji">
          📍
        </span>
      </h1>

      {/* Add new address button */}
      <button
        onClick={() => {
          setFormPopUp(true);
          setDisableEditBtn(true);
        }}
        className="add-new-address-btn p-2"
      >
        <i className="bx bx-plus-circle"></i>Add a new address
      </button>

      {/* Loader */}
      {loader && <div id="cover-spin"></div>}

      {/* Address Form */}
      <div
        style={{ display: formPopUp ? "block" : "none" }}
        className="form-wrapper"
      >
        <form className="address-form p-2 radius-5" onSubmit={submitHandler}>
          <i onClick={() => setFormPopUp(false)} className="bx bx-x-circle"></i>
          <label className="bold-text" htmlFor="name">
            Name :
          </label>
          <input
            onChange={changeHandler}
            type="text"
            name="name"
            id="name"
            value={formData.name}
            className="input-box input-default"
            placeholder="Enter your full name"
            required
          />
          <label className="bold-text" htmlFor="phone">
            Phone number :
          </label>
          <input
            onChange={changeHandler}
            type="number"
            name="phone"
            id="phone"
            value={formData.phone}
            className="input-box input-default"
            placeholder="Enter your number"
            required
          />
          <label className="bold-text" htmlFor="name">
            Country :
          </label>
          <input
            onChange={changeHandler}
            type="text"
            name="country"
            id="country"
            value={formData.country}
            className="input-box input-default"
            placeholder="Enter country name"
            required
          />
          <label className="bold-text" htmlFor="name">
            State :
          </label>
          <input
            onChange={changeHandler}
            type="text"
            name="state"
            id="state"
            value={formData.state}
            className="input-box input-default"
            placeholder="Enter state"
            required
          />
          <label className="bold-text" htmlFor="name">
            City :
          </label>
          <input
            onChange={changeHandler}
            type="text"
            name="city"
            id="city"
            value={formData.city}
            className="input-box input-default"
            placeholder="Enter city"
            required
          />
          <label className="bold-text" htmlFor="name">
            Street :
          </label>
          <input
            onChange={changeHandler}
            type="text"
            name="street"
            id="street"
            value={formData.street}
            className="input-box input-default"
            placeholder="Enter street name"
            required
          />
          <button disabled={!disableEditBtn} className="p-1 mt-1">
            Add address
          </button>
          <button
            type="button"
            onClick={updateHandler}
            disabled={disableEditBtn}
            className="p-1 mt-1"
          >
            Update Address
          </button>
        </form>
      </div>

      {address.map((addressObj) => {
        const { id, name, phone, country, state, city, street } = addressObj;
        return (
          <div className="small-text address-data p-2 m-2" key={id}>
            <div>
              <span className="bold-text">Name</span> : {name}
            </div>
            <div>
              <span className="bold-text">Phone</span> : {phone}
            </div>
            <div>
              <span className="bold-text">Country</span> : {country}
            </div>
            <div>
              <span className="bold-text">State</span> : {state}
            </div>
            <div>
              <span className="bold-text">City</span> : {city}
            </div>
            <div>
              <span className="bold-text">Street</span> : {street}
            </div>
            <button
              onClick={() => editClickHandler(addressObj)}
              className="btn primary-outline-btn mr-1 mt-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteHandler(id)}
              className="btn primary-error-btn ml-1 mt-2"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
