import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets as MUIServerStyleSheets } from '@material-ui/core/styles';

// https://stackoverflow.com/questions/63449123/how-to-add-multiple-stylesheets-to-ctx-renderpage
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const startTime = Date.now();
    const sheet = new ServerStyleSheet()
    // create MUI sheets
    const materialUISheets = new MUIServerStyleSheets();
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(materialUISheets.collect(<App {...props} />)),
        })

      const initialProps = await Document.getInitialProps(ctx)
      console.log(`styled_components_timing: ${Date.now() - startTime}ms`)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {materialUISheets.getStyleElement()}
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
            key="google-tag-manager"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'AW-997844434');
                  gtag('config', 'G-WFH58XWN7D', {
                    page_path: window.location.pathname,
                    'linker': {
                      'domains': ['zentacle.com', 'shorediving.com']
                    }
                  });
                `,
            }}
            key="ga-setup"
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