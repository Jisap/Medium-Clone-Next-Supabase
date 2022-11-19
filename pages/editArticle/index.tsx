import type { GetServerSidePropsContext, NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
import { createServerSupabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

// localhost:3000/editArticle?id=1
// we dont want to start with an empty title and content
// want to start with the articles title and content

const EditArticle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const { id } = router.query;

    const initialState = {
        title: "",
        content: ""
    }

    const [articleData, setArticleData] = useState(initialState);

    const handleChange = (e: any) => {  // Cuando escribamos en los text area cambiaremos el estado del article y se mostrarán los cambios
        setArticleData({ ...articleData, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        async function getArticle() {   // data del article según id
            const { data, error } = await supabaseClient
                .from("articles")
                .select("*")
                .filter("id", "eq", id)
                .single();
            if (error) {
                console.log(error);
            } else {
                setArticleData(data); // estado según data -> carga en los text-area la data prexistente
            }
        }
        if (typeof id !== "undefined") {
            getArticle();
        }
    }, [id])

    const editArticle = async () => { // Cuando demos al boton de editar se realizarán los cambios en la bd
        try {
            const { data, error } = await supabaseClient
                .from("articles")                           // En la tabla articles
                .update([                                   // actualizamos 
                    {
                        title: articleData.title,           // el título
                        content: articleData.content        // y el contenido del article
                    }
                ])
                .eq("id", id)                               // para el artículo del id seleccionado
            if (error) throw error;
            router.push("/article?id=" + id);               // Si todo fue bien redirección para visualizar el article como quedo.
        } catch (error: any) {
            alert(error.message);
        }
    }

    console.log(articleData);
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
                    onChange={handleChange}          // función que establece la nueva data -> el nuevo state
                    initialValue={articleData.title} // data preexistente
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
                    initialValue={articleData.content}
                />
            </Grid>
            <Grid xs={12}>
                <Text>Editing as {user?.email}</Text>
            </Grid>
            <Button onPress={ editArticle }>Update Article</Button>
        </Grid.Container>
    )
}

export default EditArticle;

// export const getServerSideProps = withPageAuth({ redirectTo: "/login" });

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx);
    // Check if we have a session
    const { data: { session } } = await supabase.auth.getSession();

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