import { profileLocationCountries } from "@/content/profile-locations";

function findCountry(countryLabel: string) {
  return profileLocationCountries.find((country) => country.label === countryLabel) ?? null;
}

export function getProfileCountryOptions() {
  return profileLocationCountries.map((country) => country.label);
}

export function getProfileCityOptions(countryLabel: string) {
  const country = findCountry(countryLabel);
  if (!country) {
    return [];
  }

  return country.cities.map((city) => city.name);
}

export function getProfileDistrictOptions(countryLabel: string, cityName: string) {
  const country = findCountry(countryLabel);
  if (!country) {
    return [];
  }

  const city = country.cities.find((item) => item.name === cityName);
  if (!city) {
    return [];
  }

  return city.districts.map((district) => district.name);
}

export function getProfilePostalCode(countryLabel: string, cityName: string, districtName: string) {
  const country = findCountry(countryLabel);
  if (!country) {
    return "";
  }

  const city = country.cities.find((item) => item.name === cityName);
  if (!city) {
    return "";
  }

  const district = city.districts.find((item) => item.name === districtName);
  return district?.postalCode ?? "";
}

export function isValidPostalCode(countryLabel: string, postalCode: string) {
  const value = postalCode.trim();

  if (countryLabel === "台灣") {
    return /^\d{3}(\d{2})?$/.test(value);
  }

  return /^\d{3,10}$/.test(value);
}
