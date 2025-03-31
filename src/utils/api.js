export function getBaseUrl() {
  return "https://webshopbackend.vercel.app/"

  // console.log(window.location.href)
  // if (window.location.href.includes('localhost')) {
  //   return "https://webshopbackend.vercel.app/"
  // }
  // return "http://localhost:5500/";
}
export async function fetchProducts(endpoint = "products") {
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url);
  if(response.ok){
    const data = await response.json();
    return data;
  }
  return [];    
}
