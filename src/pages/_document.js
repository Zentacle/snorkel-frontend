import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { v4 as uuidv4} from 'uuid';

// https://stackoverflow.com/questions/63449123/how-to-add-multiple-stylesheets-to-ctx-renderpage
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const requestId = uuidv4();
    console.log(`Start styled components:${requestId} at ${Date.now()}`)
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      console.log(`End styled components:${requestId} at ${Date.now()}`)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=G-WFH58XWN7D`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-WFH58XWN7D', {
                    page_path: window.location.pathname,
                  });
                `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}