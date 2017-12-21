/* eslint react/self-closing-comp: off */
import React from 'react';
import PropTypes from 'prop-types';
import JavascriptObject from './JavascriptObject';
import MainContent from './MainContent';

export default class Page extends React.Component {
  getChildContext() {
    const { i18n, config, adminConfig } = this.props;
    return {
      config,
      adminConfig,
      i18n,
    };
  }
  renderArea(area) {
    if (React.isValidElement(area)) {
      return area;
    }
    if (typeof area === 'function') {
      return area(this.props.pageData);
    }
    return null;
  }

  render() {
    const {
      pageData,
      pageConfig,
      runningEnvironment,
      claims,
      i18n,
      config,
      adminConfig,
      areas,
      templates,
    } = this.props;

    const {
      adminAppScript,
      adminAppCss,
      includeMainCss,
      mainCss,
      clientAppScript,
    } = pageConfig;

    const loadAdminApp = claims.isPublisher || claims.admin;
    return (
      <html lang={pageData.lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="environment" content={runningEnvironment} />
          <title>{`${pageData.pageTitle}${config.pageTitlePostfix ? config.pageTitlePostfix : ''}`}</title>
          { includeMainCss ? <link href={mainCss} rel="stylesheet" /> : null }
          <link rel="shortcut icon" href="/assets/favicon.ico" type="image/x-icon" />
          { loadAdminApp ? <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /> : null }
          { loadAdminApp ? <link href={adminAppCss} rel="stylesheet" /> : null }
          { this.renderArea(areas.headContent) }
        </head>
        <body className="page">
          <div className="page__wrapper">
            { this.renderArea(areas.topContent) }
            <main id="mainContent" className="page__main">
              <MainContent pageData={pageData} templates={templates} />
            </main>
            <JavascriptObject objectName="nocms.pageData" object={pageData} />
            <JavascriptObject objectName="nocms.config" object={config} />
            <JavascriptObject objectName="nocms.i18n" object={i18n} />
            <script type="text/javascript" src={clientAppScript}></script>

            { this.renderArea(areas.bottomContent) }

            { loadAdminApp ?
              <div className="admin__content">
                <JavascriptObject objectName="nocms.adminConfig" object={adminConfig} />
                <div id="adminPanel"></div>
                <script type="text/javascript" src={adminAppScript}></script>
              </div>
              : null }
          </div>
        </body>
      </html>
    );
  }
}

Page.propTypes = {
  pageData: PropTypes.object,
  areas: PropTypes.object,
  templates: PropTypes.array,
  runningEnvironment: PropTypes.string,
  claims: PropTypes.object,
  i18n: PropTypes.object,
  config: PropTypes.object,
  pageConfig: PropTypes.object,
  adminConfig: PropTypes.object,
};

Page.defaultProps = {
  runningEnvironment: 'server',
  isLoggedIn: false,
  isNoCMSUser: false,
  pageData: {},
  areas: {},
  claims: {},
};

Page.childContextTypes = {
  config: PropTypes.object,
  adminConfig: PropTypes.object,
  i18n: PropTypes.object,
};