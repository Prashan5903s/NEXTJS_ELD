// import { MarkCoordinate } from "../page";

// export const markCoordinates: MarkCoordinate[] = [
//   { lat: -3.7402, lng: -38.4997, label: "202" },
//   { lat: -3.746, lng: -38.524, label: "201" },
//   { lat: -3.731862, lng: -38.526669, label: "203" },
// ];



// constants.ts
import axios from 'axios';
import { MarkCoordinate } from "../page";

const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const getMarkCoordinates = async (dateStart = null, dateEnd = null): Promise<MarkCoordinate[]> => {
  try {
    const token = getCookie('token');
    if (!token) {
      console.error('No token available');
      return [];
    }

    const response = await axios.get(`${url}/assets/overview/coverage-map/${dateStart}/${dateEnd}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      const values = response.data;

      return values.map((data: any) => {
        const loctn = JSON.parse(data[0]?.location);
        const latitude = loctn?.GeoLocation?.Latitude;
        const longitude = loctn?.GeoLocation?.Longitude;
        var address = data[1];
        var words = address.split(" ");
        var lastWord = words[words.length - 1];
        
        return { lat: latitude, lng: longitude, label: lastWord };
      });
    } else {
      console.error('Unexpected response status:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return [];
  }
};

