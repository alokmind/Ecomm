✅ STEP 1 — Create the Project
Open your terminal in VS Code and run:

bash
Copy
Edit
npx create-react-app q-commerce-app
cd q-commerce-app


✅ STEP 2 — Install Dependencies
Inside your project folder, install these:

bash
Copy
Edit
npm install @reduxjs/toolkit react-redux axios react-router-dom
What you installed:

@reduxjs/toolkit — For Redux state management

react-redux — React bindings for Redux

axios — For HTTP requests

react-router-dom — For page routing

✅ STEP 3 — Clean Up Boilerplate
Open your src/ folder:

Delete: App.css, logo.svg

Clean up App.jsx and index.js so you have a blank starting point.

Example App.jsx (empty):

jsx
Copy
Edit
function App() {
  return (
    <div>
      <h1>Quick Commerce App</h1>
    </div>
  );
}

export default App;





