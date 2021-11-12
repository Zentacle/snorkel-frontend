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
                  gtag('config', 'G-WFH58XWN7D', {
                    page_path: window.location.pathname,
                    'linker': {
                      'domains': ['zentacle.com', 'shorediving.com']
                    }
                  });
                  gtag('config', 'AW-997844434');
                `,
            }}
            key="ga-setup"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window['_fs_debug'] = false;
                window['_fs_host'] = 'fullstory.com';
                window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
                window['_fs_org'] = '163NB3';
                window['_fs_namespace'] = 'FS';
                (function(m,n,e,t,l,o,g,y){
                    if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                    g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                    o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                    g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                    g.anonymize=function(){g.identify(!!0)};
                    g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                    g.log = function(a,b){g("log",[a,b])};
                    g.consent=function(a){g("consent",!arguments.length||a)};
                    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                    g.clearUserCookie=function(){};
                    g.setVars=function(n, p){g('setVars',[n,p]);};
                    g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                    if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                    g._v="1.3.0";
                })(window,document,window['_fs_namespace'],'script','user');
              `
            }}
          />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="VaV9xZTx1sjrlrGixQKCyc6hq5yq9wTv";;analytics.SNIPPET_VERSION="4.15.3";
            analytics.load("VaV9xZTx1sjrlrGixQKCyc6hq5yq9wTv");
            analytics.page();
            }}();
            `
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
