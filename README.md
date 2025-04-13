# Hakim Livs - Webshop Projekt

Detta är ett frontend projekt för en enkel e-handelsplattform med både användargränssnitt och adminpanel. Projektet är byggt med HTML, CSS och vanilla JavaScript.

## Adresser
- Webbsida: https://be-webshop-2025-fe-nine.vercel.app/
- Backend API Docs https://rustic-velvet-bd5.notion.site/Hakim-Livs-Server-API-Info-1c7c744310c780d7b9dae39a11235f6d


## Installation & Komma igång

1. **Klona repot**  
   ```   git clone <repo-url>   ```

2. **Klona repot**  
   ```   cd <projektmapp>   ```

2. **Klona repot**  
   Öppna ```index.html``` i din webbläsare.

## Kodbibliotek och Teknologier

- HTML5  
- Bootstrap - Styling ([Docs](https://getbootstrap.com/docs/5.3/getting-started/introduction/))
- JavaScript 
- Backend - Node.js
- Axios (Fetch) ([Docs](https://axios-http.com/docs/intro))
- Vercel för hosting
- Toastr - Notis när man lägger en produkt i kundkorg ([Docs](https://docs.fontawesome.com/))
- Font Awesome - Ikoner ([Docs](https://docs.fontawesome.com/))
- DataTables - Används i adminpanelen för att lista kunder, produkter, kategprier och ordrar i en tabell ([Docs](https://datatables.net/manual/))

**_De använda kodbiblioteken och teknologierna är inte installerade via npm, utan länkas in via CDN._** 


##  Projektstruktur

Här är en översikt över projektets mappstruktur:

```
├── admin                  # Adminpanel (HTML, JS) 
│ ├── assets               # Betalikoner, JS-moduler 
│ │ ├── scripts            # Script för adminpanelens funktionalitet.
│ │ ├── images             # Bilder
│ ├── dashboard            # Admin dashboard-vyer 
├── src                    # CSS, bilder 
│ ├── scripts              # Gemensam JS-logik för användarsidan 
│ ├── utils                # API-hantering och scripts 
│ ├── images               # Bilder/Logo
│ ├── css                  # Stilfiler
├── index.html             # Startsida 
├── shopping-cart.html     # Varukorgssida
```
## Viktiga filer

- scripts/services.js – Innehåller funktioner för att skapa återanvändbara produktkort samt uppdatera kundkorgen.
- scripts/search-slug.js – Hanterar både sökfunktion och skapande av URL-slugs för produkterna.
- scripts/search-slug.js – Ansvarar för autentisering i webbshopen.
- scripts/cart.js – Sköter all funktionalitet kopplad till kundkorgen.
- utils/api.js – Samlar funktioner för API-anrop. Dessa bör återanvändas genomgående i projektet.
- src/css/style.css – Projektets huvudsakliga CSS.

- admin/assets/js/*.js – JavaScript-moduler som används för adminpanelens olika delar (ex. inloggning, hantering av kunder, ordrar etc).
- admin/assets/js/services.js – Innehåller fetch-funktioner som med fördel kan återanvändas i hela adminpanelen.

## Förbättringspunkter
- Vissa funktioner bör brytas ut till separata, återanvändbara moduler för att minska kodupprepning.
- Filstruktur kan förbättras för ökad läsbarhet och bättre separation av ansvar (clean code-principer).
