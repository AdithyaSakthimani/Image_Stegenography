
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import  {Encode}  from './pages/Encode.tsx';
import  {Decode}  from './pages/Decode.tsx';
import './styles/global.css';
import './styles/layout.css';
import './styles/pages/Home.css';
import Home from './Home.tsx';
import NoteState from './components/NoteState.tsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: 
      <Home/>
    ,
  },
  {
    path: '/encode',
    element: <Encode />,
  },
  {
    path: '/decode',
    element: <Decode />,
  },
]);

function App() {
  return (
    <NoteState>
      <RouterProvider router={router} />
      </NoteState>
  );
}

export default App;