import React from "react";
import { createRoot } from 'react-dom/client'
import App from './Componentes/App'


const contenedor = document.getElementById('root');
const root = createRoot(contenedor)
root.render(<App/>)