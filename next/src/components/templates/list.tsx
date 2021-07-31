import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import {Link} from "gatsby";

const ListPage = (args) => {
    const { pageContext } = args
    return (
      <Layout>
        <SEO title={pageContext.title || `List`} />
        <h1>{pageContext.title}</h1>
          {
              pageContext.nodes.map(node => (
                <div key={node.id}>
                    {pageContext.detailsPageUrl &&
                        <Link to={`${pageContext.detailsPageUrl}/${node[pageContext.detailsPageKey]}`}>
                            {node.displayName}
                        </Link>
                    }
                    {!pageContext.detailsPageUrl && <span>{node.displayName}</span>}
                </div>
          ))
          }<br/>
      </Layout>
    )
}

export default ListPage