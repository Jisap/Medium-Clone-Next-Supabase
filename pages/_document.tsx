import React from "react";
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { CssBaseline } from "@nextui-org/react";

class MyDocument extends Document {                                                // Document Se procesa en el lado del servidor

    static async getInitialProps(ctx: DocumentContext) {                           // getInitialProps obtiene el ctx (pathname, query, aspath, req, res, err)

        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,                                                       
            styles: React.Children.toArray([initialProps.styles]),                 // al ctx se le añaden los estilos de librerias css-js
        };
    }

    render() {                                                                     // render establece la estructura básica del html a mostrar por la app
        return (                                                                   
            <Html lang="en">
                {/* Inyectamos las hojas de estilo de nextui-org */}
                <Head>{CssBaseline.flush()}</Head> 
                <body>
                    <Main />                                                        
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;