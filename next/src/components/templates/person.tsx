import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import {Link} from "gatsby";

const getPageTitle = (pageContext) => {
  const node = pageContext.node;

  if (!!node && pageContext.title && (node[pageContext.title] || node.data[pageContext.title])) {
    return node[pageContext.title] || node.data[pageContext.title];
  }

  return pageContext.title || 'Person';
};

const PersonPage = (args) => {
  const { pageContext } = args;
  const person = pageContext.node;
  const personMeta = person.data;

    return (
      <Layout>
        <SEO title={getPageTitle(pageContext)} />
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline'
          }}>
            <h2>{person.displayName}</h2>
          </div>
          <div style={{
            display: `flex`
          }}>
            <img
              style={{
                maxWidth: '400px',
                width: '50%'
              }}
              src={personMeta.photos[0].imageUrl} title={person.displayName} alt={personMeta.photos[0].attachments[0].altImageText} />
            <p style={{
              margin: `0 20px`
            }}><i>{personMeta.bio}</i></p>
          </div>
        </div>
        <p>
          <Link to={`${pageContext.listPageUrl}`}>Back to Persons</Link>
        </p>
      </Layout>
    )
}

export default PersonPage