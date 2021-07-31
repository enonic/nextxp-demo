import React, {FunctionComponent} from "react"

import Link from "next/link";

type HeaderProps = {
    siteTitle: string
}

const Header: FunctionComponent<HeaderProps> = ({ siteTitle }: HeaderProps) => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        display: `flex`,
        justifyContent: 'space-between'
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          href="/">
          <a style={{
                color: `white`,
                textDecoration: `none`,
              }}
            >
              {siteTitle}
          </a>
        </Link>
      </h1>
        {/*<Image style={{width: `80px`}} />*/}
    </div>
  </header>
)

export default Header
