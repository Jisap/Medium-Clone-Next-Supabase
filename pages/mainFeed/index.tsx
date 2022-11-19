import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState, useEffect } from "react";
import { Text } from "@nextui-org/react";
import ArticleCard from '../../components/ArticleCArd';


const MainFeed: NextPage = () => {

    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const [articles, setArticles] = useState<string[]>([]);

    useEffect(() => {
        getArticles();
    }, []);

    const getArticles = async () => {
        try {
            const { data, error } = await supabaseClient  // Pedimos a supabase la data
                .from("articles")                         // de la tabla articles  
                .select("*")                              // seleccionando todo el contenido  
                .limit(10)                                // con un límite de 10 registros      
            console.log(data);
            if (data != null) {                           // Si la data != null establecemos el estado de articles con esa data -> ArticleCard  
                setArticles(data);
            }
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <>
            <Text h2>Main Feed</Text>
            <Text size="$lg" css={{ my: "$8" }}>
                Check out articles from users here
            </Text>
            {/* Article Card */}
            {articles.map((article) => (
                <ArticleCard article={article} />
            ))}
        </>
    )

}

export default MainFeed;