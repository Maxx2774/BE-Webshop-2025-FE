
export function getBaseUrl() {
  if (!href.includes('localhost') {
    return "https://be-grupp-2.vercel.app/"
  }
  return "http://localhost:3000/";
}
export async function fetchProducts(endpoint = "api/products") {
  //! DONT USE THIS IN PRODUCTION
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if(response.ok){
    const data = await response.json();
    return data;
  }
  return [];    
}
