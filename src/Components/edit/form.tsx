'use client'
import { useState, useEffect } from "react";

export default function Form({ userData, subCl }) {
  const [userFormData, setUserFormData] = useState({
    first_name: "",
    last_name: "",
    comp_name: "",
    mobile_no: "",
    landline_no: "",
    email: "",
    status: "",
    countries: [],
    state: [],
    city: [],
    timezones: [],
    lang: [],
    dlang: "",
    dcount: "",
    dtime: "",
    dstate: "",
    dcity: "",
  });

  useEffect(() => {
    if (userData) {
      const obj = userData.timezones;
      const result = Object.keys(obj).map((key) => [key, obj[key]]);
      setUserFormData({
        first_name: userData.user.first_name,
        last_name: userData.user.last_name,
        comp_name: userData.user.comp_name,
        mobile_no: userData.user.mobile_no,
        landline_no: userData.user.landline_no,
        email: userData.user.email,
        status: userData.user.is_active,
        countries: userData.countries,
        state: userData.state,
        city: userData.city,
        timezones: result, // Setting timezones as array
        lang: userData.lang,
        dlang: userData.userInfo.language_id,
        dcount: userData.user.country_id,
        dtime: userData.user.timezone,
        dstate: userData.user.state_id,
        dcity: userData.user.city_id,
      });
    }
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    subCl(userFormData);
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="first-name">First Name</label>
        <input
          type="text"
          className="form-control"
          id="first-name"
          name="first_name"
          placeholder="Enter first name"
          value={userFormData.first_name}
          onChange={(e) =>
            setUserFormData({ ...userFormData, first_name: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="last-name">Last Name</label>
        <input
          type="text"
          className="form-control"
          id="last-name"
          name="last_name"
          placeholder="Enter last name"
          value={userFormData.last_name}
          onChange={(e) =>
            setUserFormData({ ...userFormData, last_name: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="name"> Company Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="comp_name"
          placeholder="Enter Company name"
          value={userFormData.comp_name}
          onChange={(e) =>
            setUserFormData({ ...userFormData, comp_name: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="company-name">Mobile No</label>
        <input
          type="text"
          className="form-control"
          id="mobile_no"
          name="mobile_no"
          placeholder="Enter mobile no"
          value={userFormData.mobile_no}
          onChange={(e) =>
            setUserFormData({ ...userFormData, mobile_no: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="landline-no">Landline No</label>
        <input
          type="text"
          className="form-control"
          id="landline-no"
          name="landline_no"
          placeholder="Enter landline no"
          value={userFormData.landline_no}
          onChange={(e) =>
            setUserFormData({ ...userFormData, landline_no: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          value={userFormData.email}
          onChange={(e) =>
            setUserFormData({ ...userFormData, email: e.target.value })
          }
        />
      </div>
      {userFormData.countries.length > 0 && (
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            className="form-control"
            id="country"
            name="country"
            value={userFormData.country}
            onChange={(e) =>
              setUserFormData({ ...userFormData, country: e.target.value })
            }
            defaultValue="default"
          >
            <option value="default" disabled>
              Select Country
            </option>
            {userFormData.countries.map((country) => (
              <option key={country.country_id} value={country.country_id}>
                {country.country_name}
              </option>
            ))}
          </select>
        </div>
      )}
      {userFormData.state.length > 0 && (
        <div className="form-group">
          <label htmlFor="states">State</label>
          <select
            className="form-control"
            id="states"
            name="states"
            value={userFormData.states}
            onChange={(e) =>
              setUserFormData({ ...userFormData, states: e.target.value })
            }
            defaultValue="default"
          >
            <option value="default" disabled>
              Select State
            </option>
            {userFormData.state.map((states) => (
              <option key={states.state_id} value={states.state_id}>
                {states.state_name}
              </option>
            ))}
          </select>
        </div>
      )}
      {userFormData.city.length > 0 && (
        <div className="form-group">
          <label htmlFor="cities">City</label>
          <select
            className="form-control"
            id="cities"
            value={userFormData.cities}
            onChange={(e) =>
              setUserFormData({ ...userFormData, cities: e.target.value })
            }
            defaultValue="default"
          >
            <option value="default" disabled>
              Select City
            </option>
            {userFormData.city.map((cities) => (
              <option key={cities.city_id} value={cities.city_id}>
                {cities.city_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {userFormData.timezones.length > 0 && (
        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <select
            className="form-control"
            id="timezone"
            name="timezone"
            onChange={(e) =>
              setUserFormData({ ...userFormData, timezone: e.target.value })
            }
          >
            <option value="default" disabled>
              Select Timezone
            </option>
            {userFormData.timezones.map((timezone, index) => (
              <option
                selected={userFormData.dtime == timezone[1]}
                key={index}
                value={timezone[1]}
              >
                {timezone[1]}
              </option>
            ))}
          </select>
        </div>
      )}

      {userFormData.lang.length > 0 && (
        <div className="form-group">
          <label htmlFor="langu">Language</label>
          <select
            className="form-control"
            id="langu"
            name="langu"
            onChange={(e) =>
              setUserFormData({ ...userFormData, langu: e.target.value })
            }
          >
            <option value="default" disabled>
              Select Language
            </option>
            {userFormData.lang.map((language) => (
              <option
                key={language.id}
                value={language.id}
                selected={userFormData.dlang === language.id}
              >
                {language.language_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          className="form-control"
          id="status"
          name="status"
          onChange={(e) =>
            setUserFormData({ ...userFormData, status: e.target.value })
          }
        >
          <option value="" disabled>
            {" "}
            Select Status{" "}
          </option>
          <option value="1" selected={userFormData.status == "1"}>
            Active
          </option>
          <option value="0" selected={userFormData.status == "0"}>
            Inactive
          </option>
        </select>
      </div>
      <button type="submit" className="w-100 btn btn-primary">
        Submit
      </button>
    </form>
  );
}
