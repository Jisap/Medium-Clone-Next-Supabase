import type { NextPage } from 'next';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

const Login:NextPage = () => {

    const supabaseClient = useSupabaseClient(); // Gestor de supabase
    const user = useUser();                     // Usuario de supabase según crendenciales de .env
    const router = useRouter();

    if( user ){                                 // Si existe el usuario 
        router.push("/mainFeed");               // redirección a /mainFeed
    }

    return(                                     // Sino cargamos el componente Auth         
        <Auth 
            appearance={{ theme: ThemeSupa }}   // Con el estilo de supabase
            supabaseClient={ supabaseClient }   // y el gestor de bd supabase
        />
    )
}

export default Login