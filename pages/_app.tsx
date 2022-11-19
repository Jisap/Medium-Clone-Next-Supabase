import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'; // Instancia del gestor de la bd
import { SessionContextProvider } from '@supabase/auth-helpers-react';  // Proveedor de estado para la app
import { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { Box } from '../components/Box'
import NavbarComponent from '../components/NavbarComponent';

function App({ Component, pageProps }: AppProps) {   // _app inicializa las páginas // Component es la pag activa // pageProps son props de cada pag según método de obtención de datos
  
  const [supabaseClient] = useState(() => createBrowserSupabaseClient()); // Llama a las .env.local para iniciarlo

  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
  
    <SessionContextProvider supabaseClient={ supabaseClient }>
      <NextUIProvider>
        <NavbarComponent />
        <Box css={{ px: "$12", py: "$15", mt: "$12", "@xsMax": { px: "$10" }, maxWidth: "800px", margin: "0 auto" }}>
          <Component {...pageProps} />
        </Box>
      </NextUIProvider>
    </SessionContextProvider>

  )}}

  export default App
