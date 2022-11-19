import type { NextPage } from 'next';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router';
import { Button, Grid, Text, Textarea } from '@nextui-org/react';
import { withPageAuth, createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';


const CreateArticle: NextPage = () => {

    const supabaseClient = useSupabaseClient(); // Gestor de supabase
    const user = useUser();                     // Usuario de supabase según crendenciales de .env
    const router = useRouter();

    const initialState = {                      // Estado inicial del article
        title: "",
        content: ""
    }

    const [articleData, setArticleData] = useState(initialState);

    const handleChange = (e: any) => {
        setArticleData({ ...articleData, [e.target.name]: e.target.value })
    }

    const createArticle = async () => {
        try {
            const { data, error } = await supabaseClient       // De supabase obtenemos la data y el error si existe, tras
                .from("articles")                              // la insercción en la tabla article  de todo el contenido del state del article     
                .insert([
                    {                                               
                        title: articleData.title,                   // El título
                        content: articleData.content,               // El contenido    
                        user_email: user?.email?.toLowerCase(),     // El email del usuario
                        user_id: user?.id                           // y su id
                    }
                ])
                .single()                                           // Retornamos la data como un objeto     
            if (error) throw error;                                 // Si hay algún error en el proceso lanzamos un error 
            setArticleData(initialState);                           // Limpiamos el estado para un nuevo artículo
            router.push("/mainFeed");                               // Redirección al mainFeed para ver los artículos
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (                                             
        <Grid.Container gap={1}>
            <Text h3>Title</Text>
            <Grid xs={12}>
                <Textarea
                    name="title"
                    aria-label="title"
                    placeholder="Article Title"
                    fullWidth={true}
                    rows={1}
                    size="xl"
                    onChange={handleChange}
                />
            </Grid>
            <Text h3>Article Text</Text>
            <Grid xs={12}>
                <Textarea
                    name="content"
                    aria-label="content"
                    placeholder="Article Text"
                    fullWidth={true}
                    rows={6}
                    size="xl"
                    onChange={handleChange}
                />
            </Grid>
            <Grid xs={12}>
                <Text>Posting as {user?.email}</Text>
            </Grid>
            <Button onPress={createArticle}>Create Article</Button>
        </Grid.Container>
    )
}

export default CreateArticle;

//export const getServerSideProps = withPageAuth({ redirectTo: "/login" })

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx);
    // Check if we have a session
    const { data: { session }} = await supabase.auth.getSession();

    if (!session)
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        };

    return {
        props: {
            initialSession: session,
            user: session.user
        }
    };
};